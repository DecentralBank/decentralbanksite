;(function ( $, window, document, undefined ) {

    $body = $( 'body' );

    $.cbFlyNav = function( options, element ) {
        this.$el = $( element );
        this._init( options );
    };

    $.cbFlyNav.defaults = {
        trigger: '.btn-flyout-trigger'
        ,cbNavWrapper: '#left-flyout-nav'
        ,cbContentWrapper: '.layout-right-content'
        ,minWidth: 768
    };

    $.cbFlyNav.mobilecheck = function(){
        var check = false;
        (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    $.cbFlyNav.prototype = {

        _init : function( options ) {
            this.options = $.extend({}, $.cbFlyNav.defaults, options);

            //Cache elements and intit variables
            this._config();

            //Initialize event listenters
            this._initEvents();
        },

        _config : function() {
            this.open = false;
            this.copied = false;
            this.subNavOpen = false;
            this.wasOpened = false;
            this.$cbWrap = $('<div class="cbFlyNav-wrap"></div>');
            this.eventtype = ($.cbFlyNav.mobilecheck()) ? 'touchstart' : 'click';
            this.$trigger = $(this.options.trigger);
            this.$regMenus = this.$el.children( 'ul.nav.nav-pill' );
            this.$newMenus = $(this.$el.clone());
            this.$contentMask = $('<a class="nav-flyout-contentmask" href="#"></a>');
            this.$navMask = $('<a class="nav-flyout-navmask" href="#"></a>');
            this.$openSubnav = "";
        },

        _initEvents : function() {
            var self = this;

            self.$trigger.on(self.eventtype+'.cbFlyNav', function(e) {
                console.log(this);
                e.stopPropagation();
                e.preventDefault();

                if ( !self.open ) {
                    if ( !self.copied ) {
                        self._copyNav();
                    }
                    self._openNav();
                }
                else {
                    self._closeNav();
                }
                self.wasOpened = true;

                //console.log('WasOpened: '+self.wasOpened+ '. Open? '+self.open);
            });

            //Hide menu when window is bigger than allowed minWidth
            $(window).on('resize', function() {
                var windowWidth = $(window).width();
                if(self.open && windowWidth > self.options.minWidth){
                    self._closeNav();
                }
            });

            //Hide menu when body clicked. Usign an a tag to mask content.
            self.$contentMask.on(self.eventtype+'.cbFlyNav', function( e ) {
                e.preventDefault();
                self._closeNav();
            });

            self.$navMask.on(self.eventtype+'.cbFlyNav', function( e ) {
                e.preventDefault();
                self._closeSubNav();
            });

            //Handle clicks inside menu
            self.$newMenus.on( self.eventtype+'.cbFlyNav', function( e ) {
                e.stopPropagation();
                var $menu = $(this);

                //console.log("Menu clicked");
            });

            //Handle menu item clicks
            self.$newMenus.children().find('li').on(self.eventtype+'.cbFlyNav', function(e) {
                e.stopPropagation();
                var $item = $(this),
                    $subnav = $item.find('ul.subnav');

                if ($subnav.length > 0) {
                    //item with subnav clicked
                    e.preventDefault();
                    //console.log("Item with subnav clicked");

                    $subnav.css('height', window.innerHeight);
                    self._openSubNav($subnav);
                }
                else {
                    //item without subnav clicked
                    //console.log("Item without subnav clicked");
                }
            });

        },

        _copyNav : function() {
            var self = this;
            //console.log("copying nav");

            var newWrap = $('<div class="cbFlyNav-wrap"></div>');
            self.$newMenus.children( 'ul.nav.nav-pill' ).each(function() {
                $this = $(this);
                $this.removeClass('nav-pill').addClass('nav-flyout');
                $this.find('.caret').replaceWith('<i class="icon-cbmore"></i>');
            });

            $(self.options.cbNavWrapper).prepend(self.$cbWrap.prepend(self.$newMenus));
            self.copied = true;

        },

        openNav : function() {
            if ( !this.open ) {
                this._openNav();
            }
        },

        _openNav : function() {
            var self = this;
            //console.log("Opening Nav");

            $(self.options.cbNavWrapper).addClass('isCbFlyNavActive');
            $(self.options.cbContentWrapper)
                .addClass('isCbFlyNavActive')
                .append(self.$contentMask);

            self.open = true;
        },

        closeNav : function() {
            if ( !this.close ) {
                this._closeNav();
            }
        },

        _closeNav : function() {
            var self = this;
            //console.log("Closing Nav");

            $(self.options.cbNavWrapper).removeClass('isCbFlyNavActive');
            $(self.options.cbContentWrapper).removeClass('isCbFlyNavActive');

            if(self.subNavOpen) {
                self._closeSubNav();
            }
            self.$contentMask.detach();

            self.open = false;
        },

        _openSubNav : function($subnav) {
            var self = this,
                $parent = $subnav.parent('li');

            $subnav.addClass('is-subnav-visible');
            $parent.addClass('is-active');
            self.$newMenus.addClass('is-inactive');
            self.$cbWrap.append(self.$navMask);

            $subnav.on(self.eventtype+'.cbFlyNav', function(e) {
                e.stopPropagation();
            });

            self.$openSubnav = $subnav;
            self.subNavOpen = true;
        },

        _closeSubNav : function() {
            var self = this,
                $parent = self.$openSubnav.parent('li');

            self.$openSubnav.removeClass('is-subnav-visible');
            $parent.removeClass('is-active');
            self.$newMenus.removeClass('is-inactive');
            self.$navMask.detach();

            self.$openSubnav.off(self.eventtype+'.cbFlyNav');

            self.$openSubnav = "";
            self.subNavOpen = false;
        }
    };


    $.fn.cbFlyout = function ( options ) {
        this.each(function() {
            var instance = $.data( this, 'cbFlyout' );
            if ( instance ) {
                instance._init();
            }
            else {
                instance = $.data( this, 'cbFlyout', new $.cbFlyNav( options, this ) );
            }
        });

        return this;
    };

}(jQuery, window, document));