/**
 * datebox - jQuery EasyUI
 *
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 * Dependencies:
 *     calendar
 *   combo
 *
 */
(function ($) {
    /**
     * create date box
     */
    function createBox(target) {
        var state = $.data(target, 'datebox');
        var opts = state.options;

        $(target).addClass('datebox-f').combo($.extend({}, opts, {
            onShowPanel: function () {
                setCalendarSize();
                opts.onShowPanel.call(target);
            }
        }));
        $(target).combo('textbox').parent().addClass('datebox');

        /**
         * if the calendar isn't created, create it.
         */
        if (!state.calendar) {
            createCalendar();
        }

        function createCalendar() {
            var panel = $(target).combo('panel');
            state.calendar = $('<div></div>').appendTo(panel).wrap('<div class="datebox-calendar-inner"></div>');
            state.calendar.calendar({
                fit: true,
                border: false,
                onSelect: function (date) {
                    var value = opts.formatter(date);
                    setValue(target, value);
                    $(target).combo('hidePanel');
                    opts.onSelect.call(target, date);
                }
            });
            setValue(target, opts.value);

            var button = $('<div class="datebox-button"></div>').appendTo(panel);
            var current_btn = $('<a href="javascript:void(0)" class="datebox-current"></a>').html(opts.currentText).appendTo(button);
            var close_btn = $('<a href="javascript:void(0)" class="datebox-close"></a>').html(opts.closeText).appendTo(button);
            current_btn.click(function () {
                state.calendar.calendar({
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    current: new Date()
                });
            });
            close_btn.click(function () {
                $(target).combo('hidePanel');
            });
        }

        function setCalendarSize() {
            if (opts.panelHeight != 'auto') {
                var panel = $(target).combo('panel');
                var ci = panel.children('div.datebox-calendar-inner');
                var height = panel.height();
                panel.children().not(ci).each(function () {
                    height -= $(this).outerHeight();
                });
                ci._outerHeight(height);
            }
            state.calendar.calendar('resize');
        }
    }

    /**
     * called when user inputs some value in text box
     */
    function doQuery(target, q) {
        setValue(target, q);
    }

    /**
     * called when user press enter key
     */
    function doEnter(target) {
        var state = $.data(target, 'datebox');
        var opts = state.options;
        var c = state.calendar;
        var value = opts.formatter(c.calendar('options').current);
        setValue(target, value);
        $(target).combo('hidePanel');
    }

    function setValue(target, value) {
        var state = $.data(target, 'datebox');
        var opts = state.options;
        $(target).combo('setValue', value).combo('setText', value);
        state.calendar.calendar('moveTo', opts.parser(value));
    }

    $.fn.datebox = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.datebox.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.combo(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'datebox');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'datebox', {
                    options: $.extend({}, $.fn.datebox.defaults, $.fn.datebox.parseOptions(this), options)
                });
            }
            createBox(this);
        });
    };

    $.fn.datebox.methods = {
        options: function (jq) {
            var copts = jq.combo('options');
            return $.extend($.data(jq[0], 'datebox').options, {
                originalValue: copts.originalValue,
                disabled: copts.disabled,
                readonly: copts.readonly
            });
        },
        calendar: function (jq) {	// get the calendar object
            return $.data(jq[0], 'datebox').calendar;
        },
        setValue: function (jq, value) {
            return jq.each(function () {
                setValue(this, value);
            });
        },
        reset: function (jq) {
            return jq.each(function () {
                var opts = $(this).datebox('options');
                $(this).datebox('setValue', opts.originalValue);
            });
        }
    };

    $.fn.datebox.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo.parseOptions(target), {});
    };

    $.fn.datebox.defaults = $.extend({}, $.fn.combo.defaults, {
        panelWidth: 180,
        panelHeight: 'auto',

        keyHandler: {
            up: function () {
            },
            down: function () {
            },
            enter: function () {
                doEnter(this);
            },
            query: function (q) {
                doQuery(this, q);
            }
        },

        currentText: 'Today',
        closeText: 'Close',
        okText: 'Ok',

        formatter: function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            return m + '/' + d + '/' + y;
        },
        parser: function (s) {
            var t = Date.parse(s);
            if (!isNaN(t)) {
                return new Date(t);
            } else {
                return new Date();
            }
        },

        onSelect: function (date) {
        }
    });
})(jQuery);
