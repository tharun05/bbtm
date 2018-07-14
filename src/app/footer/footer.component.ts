import {Component, OnInit, HostListener,ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
import {mixpanelService} from '../services/mixpanel.service';
import {Router} from "@angular/router";


window['$'] = window['jQuery'] = $;

@Component({
    selector: 'app-ld-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None

})
export class FooterComponent implements OnInit {

    openedFooter;
    activeLang;
    selectLang: boolean = false;
    activePage;
    constructor(
        private mixpaneldataService: mixpanelService,
        private router: Router
    ) {}

    @HostListener('window:resize') onResize() {
        // guard against resize before view is rendered
        var ww = document.body.clientWidth;
        if (ww > 1199) {
            $(".footer-link-subsection").css("display", "");
        }
    }

    ngOnInit() {
        this.activeLang = 'EN';
        this.selectLang = false;
        this.activePage = '';
        $(".footer-link-parent").click(function () {
            var ww = document.body.clientWidth;
            if (ww <= 1199) {
                let $parent = $(this).parent();
                let $label = $parent.children(".footer-link-parent");
                let $subSection = $parent.children(".footer-link-subsection");
                $('.footer-link-parent').removeClass('activeFooterLink');
                if ($subSection.hasClass("opened-footer")) {
                    $(".footer-link-subsection.opened-footer").slideToggle("slow").removeClass("opened-footer");
                } else {
                    $(".footer-link-subsection.opened-footer").slideToggle("slow").removeClass("opened-footer");
                    $subSection.addClass("opened-footer").slideToggle("slow");
                    $label.addClass('activeFooterLink');
                }
            }

        });
    }

    ngAfterViewInit() {
        $("html").click(function (event) {
            if ($(event.target).closest('.language-selector').length === 0) {
                $('.dropdown-footer').hide();
                $('.wrapper-dropdown-3').removeClass('active');
            }
        });
    }

    getActiveLang(activeLanguage) {
        this.activeLang = activeLanguage;
        this.setLanguage(this.activeLang);
    }

    changeLanguage(activeClass) {
        if (activeClass) {
            this.selectLang = false;
        } else {
            this.selectLang = true;
        }
        $('.dropdown-footer').toggle();
    }

    setLanguage(newLanguage) {
        this.selectLang = false;
        var opt = $("#" + newLanguage).children();
        var newlang = opt.html();
        $('.selected-language-f').html(newlang);
        $('.selected-language-f').children('.lang-icon').addClass('lang-icon-f');
        $('.lang-icon-f').removeClass('lang-icon');
        $('.selected-language-f').children('.langg-text').addClass('langg-text-f');
        $('.langg-text-f').removeClass('langg-text');
        $('.selected-language-h').html(newlang);
        $('.selected-language-h').children('.lang-icon').addClass('lang-icon-h');
        $('.lang-icon-h').removeClass('lang-icon');
        $('.selected-language-h').children('.langg-text').addClass('langg-text-h');
        $('.langg-text-h').removeClass('langg-text');
        $('.dropdown').hide();
        $('.dropdown-footer').hide();
    }

    mobileRouting(side, route): void {
        this.router.navigate([route]);
        if(route == '/bingo'){
            this.activePage='bingo';
        }else if(route == '/casino'){
            this.activePage='casino';
        }else if(route == '/scratch'){
            this.activePage='scratch';
        }else{
            this.activePage='';
        }
        $('body').toggleClass('navOpen-' + side);
        side == 'right' ? $('.modal-body').toggleClass('modalOpenRight') : $('.modal-body').toggleClass('modalOpenLeft');
    }


    mixPanelEventCheck(type, gameName): void {
        Promise.resolve(this.mixpaneldataService.footer(type, gameName));
    }
}
