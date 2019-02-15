import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import classnames from 'classnames';

import { PERSON_RELATION, LOCATION_RELATION } from '../constants/relationTypes';
import makeCancelable from '../utils/makeCancelable';
import findRelations from '../utils/findRelations';
import PersonFinderResults from './PersonFinderResults';
import Input from '../../react-chayns-input/component/Input';
import InputBox from '../../react-chayns-input_box/component/InputBox';
import WaitCursor from './WaitCursor';

const WAIT_CURSOR_TIMEOUT = 500;

export default class PersonFinderData extends Component {
    static propTypes = {
        take: PropTypes.number,
        persons: PropTypes.bool,
        sites: PropTypes.bool,
        onSelect: PropTypes.func.isRequired,
        value: PropTypes.func,
        selectedValue: PropTypes.bool,
    };

    static defaultProps = {
        take: 20,
        persons: true,
        sites: true,
        value: '',
        selectedValue: false,
    };

    state = {
        value: null,
        persons: { related: [], unrelated: [] },
        sites: { related: [], unrelated: [] },
        showWaitCursor: false,
    };

    promises = {
        [PERSON_RELATION]: null,
        [LOCATION_RELATION]: null,
    };

    skip = {
        [PERSON_RELATION]: 0,
        [LOCATION_RELATION]: 0,
    };

    constructor(props) {
        super(props);

        this.setValue = debounce(this.setValue.bind(this), 500);
        this.fetchPersonRelations = this.fetchRelations.bind(this, PERSON_RELATION);
        this.fetchSiteRelations = this.fetchRelations.bind(this, LOCATION_RELATION);
    }

    componentDidUpdate() {
        const { value, selectedValue } = this.props;
        const { value: stateValue } = this.state;

        if (!selectedValue && stateValue !== value) {
            this.setValue('');
            this.setValue(value);
        }
    }

    setValue(value) {
        this.setState({
            value,
        });

        if (value === '') {
            this.setState({
                persons: { related: [], unrelated: [] },
                sites: { related: [], unrelated: [] },
            });

            return;
        }

        this.fetchData(value);
    }

    showWaitCursor() {
        clearTimeout(this.waitCursorTimeout);

        this.waitCursorTimeout = window.setTimeout(() => {
            this.setState({
                showWaitCursor: true,
            });
        }, WAIT_CURSOR_TIMEOUT);
    }

    hideWaitCursor() {
        clearTimeout(this.waitCursorTimeout);

        this.setState({
            showWaitCursor: false,
        });
    }

    async fetchData(value, clear = true) {
        if (clear || value === '') {
            this.skip[LOCATION_RELATION] = 0;
            this.skip[PERSON_RELATION] = 0;
        }

        const { persons: enablePersons, sites: enableSites } = this.props;

        const promises = [];

        promises.push(enablePersons ? this.fetchPersonRelations(value) : Promise.resolve(false));
        promises.push(enableSites ? this.fetchSiteRelations(value) : Promise.resolve(false));

        try {
            this.showWaitCursor();
            const [personResults, siteResults] = await Promise.all(promises);
            this.hideWaitCursor();

            const { persons: personsState, sites: sitesState } = this.state;

            const persons = clear ? { related: [], unrelated: [] } : personsState;
            const sites = clear ? { related: [], unrelated: [] } : sitesState;

            if (personResults) {
                this.skip[PERSON_RELATION] += (personResults.related.length + personResults.unrelated.length);

                persons.related.push(...personResults.related);
                persons.unrelated.push(...personResults.unrelated);
            }

            if (siteResults) {
                this.skip[LOCATION_RELATION] += (siteResults.related.length + siteResults.unrelated.length);

                sites.related.push(...siteResults.related);
                sites.unrelated.push(...siteResults.unrelated);
            }

            this.setState({
                persons,
                sites,
            });
        } catch (ex) {
            if (!ex || !ex.isCanceled) {
                throw ex;
            }
        }
    }

    async fetchRelations(type, value) {
        const { take } = this.props;

        if (this.promises[type]) {
            this.promises[type].cancel();
        }

        this.promises[type] = makeCancelable(findRelations(type, value, this.skip[type], take));

        return this.promises[type].promise;
    }

    hasEntries() {
        const { persons, sites } = this.state;

        return persons.related.length > 0 || persons.unrelated.length > 0 || sites.related.length > 0 || sites.unrelated > 0;
    }

    renderChildren() {
        const {
            onSelect,
            selectedValue,
        } = this.props;

        const { persons, sites, showWaitCursor } = this.state;

        const hasEntries = this.hasEntries();

        if (!selectedValue && hasEntries) {
            return [
                showWaitCursor && (<WaitCursor />),
                <PersonFinderResults
                    persons={persons}
                    sites={sites}
                    onSelect={onSelect}
                />
            ];
        }

        if (showWaitCursor) {
            return (
                <WaitCursor />
            );
        }

        return null;
    }

    render() {
        const {
            onSelect,
            selectedValue,
            value,
            persons: enablePersons,
            sites: enableSites,
            ...props
        } = this.props;

        return (
            <InputBox
                inputComponent={Input}
                value={value}
                onChange={this.handleOnChange}
                boxClassName={classnames('cc__person-finder__overlay')}
                {...props}
            >
                {this.renderChildren()}
            </InputBox>
        );
    }
}
