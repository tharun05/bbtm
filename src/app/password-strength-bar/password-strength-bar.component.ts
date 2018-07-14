
// Based on: https://blog.brunoscopelliti.com/angularjs-directive-to-test-the-strength-of-a-password/

import {Component, OnChanges, Input, SimpleChange} from '@angular/core';

@Component({
    selector: 'password-strength-bar',
    templateUrl: './password-strength-bar.component.html',
    styleUrls: ['./password-strength-bar.component.scss']
})
export class PasswordStrengthBarComponent implements OnChanges {
    @Input() passwordToCheck: string;
    @Input() barLabel: string;
    bar0: string;
    bar1: string;
    bar2: string;
    bar3: string;
    bar4: string;
    strengthMessage: string;

    private colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];

    private static measureStrength(p) {
        var force = 0;
        var regex = /[$-/:-?{-~!^_`\[\]"@&!#]/   ///[$-/:-?{-~!"^_`\[\]]/g; // "

        var lowerLetters = /[a-z]+/.test(p);
        var upperLetters = /[A-Z]+/.test(p);
        var numbers = /[0-9]+/.test(p);
        var symbols = regex.test(p);

        var flags = [lowerLetters, upperLetters, numbers, symbols];

        var passedMatches = 0;
        for (let flag of flags) {
            passedMatches += flag === true ? 1 : 0;
        }
        
       if(p.length < 4){
           return 1;
       }else {
           return passedMatches;
       }
        

    }
    private getColor(s) {
        var idx = 0;
        if (s <= 1) {
            idx = 0;
        }
        else if (s <= 2) {
            idx = 1;
        }
        else if (s <= 3) {
            idx = 2;
        }
        else if (s <= 4) {
            idx = 3;
        }
        else {
            idx = 4;
        }
        return {
            idx: idx + 1,
            col: this.colors[idx]
        };
    }

 
    ngOnChanges(changes: {[propName: string]: SimpleChange}): void {
        var password = changes['passwordToCheck'].currentValue;            
        if (password) {
            let c = this.getColor(PasswordStrengthBarComponent.measureStrength(password));
            this.setBarColors(c.idx, c.col);
            this.setStrengthStatus(c.idx)
        }
    }
    private setBarColors(count, col) {
        this.clearstrength();
        for (let _n = 0; _n < count; _n++) {
            this['bar' + _n] = col;
        }
        this.strengthMessage = col;
    }

    clearstrength(){
        for (let _n = 0; _n < 4; _n++) {
            this['bar' + _n] = '';
        }
    }
     private strengthStatus ='weak';
    setStrengthStatus(index){
        if(index <=1 ){
            this.strengthStatus ='weak';
        }else if(index <= 2){
            this.strengthStatus ='weak';
        }else if(index <= 3){
            this.strengthStatus ='moderate';
        }else{
            this.strengthStatus ='strong';
        }

    }
}
