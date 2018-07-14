import { Injectable } from '@angular/core';
import { AppLottodayService } from '../app-lottoday.service';

@Injectable()
export class BingoDataService {
  bingoRooms: any

  constructor(private lottodayService:AppLottodayService) { }

  getBingoRooms(forceful):Promise<String> {
    if (!forceful) {
      return this.bingoRooms;
    }
    return Promise.resolve(this.lottodayService.getBingoRooms())
          .then(resp => {
            this.bingoRooms = resp;
            return resp;
          })
  }

  getGameUrl(roomId): Promise<String> {
  	return Promise.resolve(this.lottodayService.getGameUrl(roomId))
            .then(resp => {
                if (resp && resp['url']) {
                    return resp['url'];
                } else {
                	return null;
                }
            });
  }	
}
