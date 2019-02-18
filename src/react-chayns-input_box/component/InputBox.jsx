import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import classnames from 'classnames';

import isDescendant from '../../utils/isDescendant';

export default class InputBox extends Component {
    static propTypes = {
        inputComponent: PropTypes.node.isRequired,
        parent: PropTypes.node,
        onFocus: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.node,
            PropTypes.arrayOf(PropTypes.node),
        ]),
        className: PropTypes.string,
        boxClassName: PropTypes.string,
    };

    static defaultProps = {
        parent: document.getElementsByClassName('tapp')[0],
        onFocus: null,
        children: null,
        className: null,
        boxClassName: null,
    };

    state = {
        hidden: true,
    };

    references = {
        box: null,
        wrapper: null,
    };

    constructor(props) {
        super(props);

        this.setWrapperRef = this.setRef.bind(this, 'wrapper');
        this.setBoxRef = this.setRef.bind(this, 'box');
        this.handleBlur = this.handleBlur.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }

    componentDidMount() {
        document.addEventListener('click', this.handleBlur);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleBlur);
    }

    setRef(name, ref) {
        this.references[name] = ref;
    }

    getCurrentRect() {
        if (!this.references.wrapper) {
            return null;
        }

        return this.references.wrapper.getBoundingClientRect();
    }

    handleBlur(e) {
        if (e.target === this.references.wrapper || e.target === this.references.box) {
            return;
        }

        if (isDescendant(this.references.wrapper, e.target) || isDescendant(this.references.box, e.target)) {
            return;
        }

        this.setState({
            hidden: true,
        });
    }

    handleFocus(e) {
        const { onFocus } = this.props;

        this.setState({
            hidden: false,
        });

        if (onFocus) {
            return onFocus(e);
        }

        return null;
    }

    render() {
        const {
            inputComponent: InputComponent,
            children,
            parent,
            onFocus,
            className,
            boxClassName,
            ...props
        } = this.props;
        const { hidden } = this.state;

        if (!InputComponent) {
            return null;
        }

        const rect = this.getCurrentRect();

        return (
            <div
                style={{
                    display: 'inline-block'
                }}
                className={classnames('cc__input-box', className)}
                ref={this.setWrapperRef}
            >
                <InputComponent
                    {...props}
                    onFocus={this.handleFocus}
                />
                {createPortal(rect && !hidden && children && (
                    <div
                        onClick={e => e.preventDefault()}
                        className={classnames('cc__input-box__overlay', 'scrollbar', boxClassName)}
                        style={rect ? {
                            width: `${rect.width}px`,
                            top: `${rect.bottom}px`,
                            left: `${rect.left}px`,
                        } : null}
                        ref={this.setBoxRef}
                    >
                        {children}
                    </div>
                ), parent)}
            </div>
        );
    }
}