module.exports = function resolveAbsoluteImport(importName) {
    const values = {
        Accordion: 'react-chayns-accordion/component/Accordion.js',
        AccordionIntro: 'react-chayns-accordion/component/AccordionIntro.js',
        AmountControl: 'react-chayns-amountcontrol/component/AmountControl.js',
        Badge: 'react-chayns-badge/component/Badge.js',
        Button: 'react-chayns-button/component/Button.js',
        ChooseButton: 'react-chayns-button/component/ChooseButton.js',
        Calendar: 'react-chayns-calendar/component/Calendar.js',
        Checkbox: 'react-chayns-checkbox/component/Checkbox.js',
        ComboBox: 'react-chayns-combobox/component/ComboBox.js',
        ContextMenu: 'react-chayns-contextmenu/component/ContextMenu.js',
        EmojiInput: 'react-chayns-emoji_input/component/EmojiInput.js',
        ExpandableContent: 'react-chayns-expandable_content/component/ExpandableContent.js',
        FormattedInput: 'react-chayns-formatted_input/component/FormattedInput.js',
        Formatter: 'react-chayns-formatted_input/utils/Formatter.js',
        Gallery: 'react-chayns-gallery/component/Gallery.js',
        GridCalendar: 'react-chayns-gridcalendar/component/GridCalendar.js',
        Icon: 'react-chayns-icon/component/Icon.js',
        Input: 'react-chayns-input/component/Input.js',
        IntegerFormatter: 'react-chayns-formatted_input/utils/IntegerFormatter.js',
        List: 'react-chayns-list/component/List.js',
        ListItem: 'react-chayns-list/component/ListItem.js',
        ModeSwitch: 'react-chayns-modeswitch/component/ModeSwitch.js',
        Mode: 'react-chayns-modeswitch/component/Mode.js',
        DecimalFormatter: 'react-chayns-formatted_input/utils/DecimalFormatter.js',
        OrientationHelper: 'utils/OrientationHelper.js',
        OpeningTimes: 'react-chayns-openingtimes/component/OpeningTimes.js',
        PersonFinder: 'react-chayns-personfinder/component/PersonFinder.js',
        PriceFormatter: 'react-chayns-formatted_input/utils/PriceFormatter.js',
        RadioButton: 'react-chayns-radiobutton/component/RadioButton.js',
        ReceiverInput: 'react-chayns-receiverinput/component/ReceiverInput.js',
        RfidInput: 'react-chayns-rfid_input/component/RfidInput.js',
        ScrollView: 'react-chayns-scrollview/component/ScrollView.js',
        SelectButton: 'react-chayns-selectbutton/component/SelectButton.js',
        SelectList: 'react-chayns-selectlist/component/SelectList.js',
        SelectListItem: 'react-chayns-selectlist/component/SelectItem.js',
        SetupWizard: 'react-chayns-setupwizard/component/SetupWizard.js',
        SetupWizardItem: 'react-chayns-setupwizard/component/SetupItem.js',
        SharingBar: 'react-chayns-sharingbar/component/SharingBar.js',
        SmallWaitCursor: 'react-chayns-smallwaitcursor/component/SmallWaitCursor.js',
        TextArea: 'react-chayns-textarea/component/TextArea.js',
        TextString: 'react-chayns-textstring/component/TextString.js',
        Tooltip: 'react-chayns-tooltip/component/Tooltip.js',
        FileInput: 'react-chayns-file_input/component/FileInput.js',
        Slider: 'react-chayns-slider/component/Slider.js',
        imageUpload: 'utils/imageUpload.js',
        FORMAT_INTEGER: 'react-chayns-formatted_input/component/FormattedInput/instances/formatInteger.js',
        FORMAT_DECIMAL: 'react-chayns-formatted_input/component/FormattedInput/instances/formatDecimal.js',
        FORMAT_PRICE: 'react-chayns-formatted_input/component/FormattedInput/instances/formatPrice.js',
    };

    if (!values[importName]) {
        throw new Error(`Unable to resolve ${importName} from chayns-components. Please check the spelling. If it's not wrong please create an issue (https://github.com/TobitSoftware/chayns-components/issues).`);
    }

    return `chayns-components/lib/${values[importName]}`;
};
