import { OnInit, Component } from "@angular/core";
import {EmitterService} from '../services/emitter.service';


@Component({
    selector:'app-onlineplayers',
    templateUrl:'./app-onlineplayer.component.html',
    styleUrls:['./app-onlineplayer.component.scss']
})
export class AppOnlinePlayers implements OnInit{

    constructor(
        private emitterService:EmitterService
    ){

    }

    ngOnInit(){

    }
}