import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import * as socketIo from 'socket.io-client';
import { Socket } from './socket-interface';
import { Utility } from '../utils/utility';
import { UserDetailsService } from '../services/user-details.service';
import { GameWinHistoryService} from '../services/game-win-history.service';
declare var io: {
  connect(url: string): Socket;
};
@Injectable()
export class SocketService {
  socket: Socket;
  socketUrl: string;
  partnerId: string;
  sessionId: string;
  isSessionSocketCreated: boolean = false;
  isPartnerSocketCreated: boolean=false;
  isForceDisconnect = false;
  observer: Observer<any>;
  constructor(
    private userDetailsService: UserDetailsService,
    private gameWinHistoryService:GameWinHistoryService,
    private utility:Utility
  ) {

  }

  setSocketURL(socketUrl) {
    this.socketUrl = socketUrl;
  }

  setSocketId(sessionId) {
    this.sessionId = sessionId;
  }

  setPartnerId(partnerId) {
    this.partnerId = partnerId
  }
 
  connectToSocket(eventType) {
    if(this.socketUrl){
      var self= this;
      if((eventType == "authCode" && !self.isSessionSocketCreated) || (eventType == "winEvent" && !self.isPartnerSocketCreated)){
       //both the below two line are not required
        self.isSessionSocketCreated = false;
        self.isPartnerSocketCreated = false;
        if(self.socket && self.socket["connected"]){
          self.socket["disconnect"]();
        }else if(self.socket && !self.socket["connected"]){
          self.isForceDisconnect = true;
        }else{
          self.socket = socketIo(self.socketUrl);
        }
      }

      self.socket.on('connect',function(esocket){
        if(self.isForceDisconnect){
          self.isForceDisconnect = false;
          self.socket["disconnect"]();
        }else{
          if(self.sessionId && !self.isSessionSocketCreated){
            self.isSessionSocketCreated = true;
            self.socket.emit("setAuthCode", self.sessionId);
          }
          if(self.partnerId  && !self.isPartnerSocketCreated){
            self.isPartnerSocketCreated = true;
            self.socket.emit("listenWinEventMessage", self.partnerId);
          }
          self.socket.on('winEventMessage', function(msg) {
            let message = {
              	"screenName": msg.playerName,
              	"amountInHouseCurrency": msg.winAmountInInHouseCurrency,
              	"currency": msg.ecrCurrency,
                "gameTypeId": msg.gameTypeId,
                "playerName":msg.playerName,
                "gameName": self.utility.getGameName(msg.gameTypeId) ,
                "gameType":'',
            }
           self.gameWinHistoryService.setWinHistoryList(message,'socket');
          });
          self.socket.on('message', (data) => {
              if (data['messageName'] && data['messageName'].includes("PushRealBalance")) {
                self.userDetailsService.setCashBalance(Number(data["cashBalance"]));
                self.userDetailsService.setBonusBalance(Number(data["bonusBalance"]));
                self.userDetailsService.setUserBalance(Number(data["cashBalance"]) + Number(data["bonusBalance"]));
              }
          });
        }

      });

      self.socket.on('disconnect',function(){
        self.socket = socketIo(self.socketUrl);
      })
    }
  }

  private handleError(error) {
    if (error.error instanceof Error) {
      let errMessage = error.error.message;
      return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }
}
