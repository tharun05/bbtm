import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GameWinHistoryService {

    private winList = [];
    private totalGame = [];

    constructor() {

    }

    setTotalGames(games) {
        this.totalGame = games;
    }

    getTotalGames() {
        return this.totalGame;
    }

    setWinHistoryList(data: any, type?: string) {
        if (type === 'socket') {
            this.winList.push(data);
        } else {
            this.winList = [];
            this.winList = data;
        }
        if (this.winList) {
            this.broadcastWinListResponse(this.winList);
        }

    }

    getWinHistoryList(): Array<any> {
        return this.winList;
    }

    private winListResponse = new Subject<any>();
    winListResponse$ = this.winListResponse.asObservable();

    broadcastWinListResponse(resp) {
        this.winListResponse.next(resp);
    }




}