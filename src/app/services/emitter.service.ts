import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Utility } from '../utils/utility'

@Injectable()
export class EmitterService {

  constructor(private utils:Utility){

  }
  // Observable string sources
  private loginCompleteSource = new Subject<string>();

  loginComplete$ = this.loginCompleteSource.asObservable();

  broadcastLoginComplete(loginStatus: string) {
    this.loginCompleteSource.next(loginStatus);
  }

  private depositLimitTimerCompleted = new Subject<string>();

  depositLimitTimerCompleted$ = this.depositLimitTimerCompleted.asObservable();

  broadcastDepositLimitTimerCompleted(depositLimit: string) {
    this.depositLimitTimerCompleted.next(depositLimit);
  }

  private lossLimitTimerCompleted = new Subject<string>();

  lossLimitTimerCompleted$ = this.lossLimitTimerCompleted.asObservable();

  broadcastLossLimitTimerCompleted(sessionLimit: string) {
    this.lossLimitTimerCompleted.next(sessionLimit);
  }

  private wagerLimitTimerCompleted = new Subject<string>();

  wagerLimitTimerCompleted$ = this.wagerLimitTimerCompleted.asObservable();

  broadcastWagerLimitTimerCompleted(sessionLimit: string) {
    this.wagerLimitTimerCompleted.next(sessionLimit);
  }

  private profileCompletedSource = new Subject<string>();

  profileCompletedSource$ = this.profileCompletedSource.asObservable();

  broadcastProfileCompletedSource(profileCompletedStatus: string) {
    this.profileCompletedSource.next(profileCompletedStatus);
  }

  private txnCompleteSource = new Subject<string>();

  txnComplete$ = this.txnCompleteSource.asObservable();

  broadcasttxnComplete(txnStatus: string) {
    this.txnCompleteSource.next(txnStatus);
  }

  private userDataSource = new Subject<string>();

  userDataSource$ = this.userDataSource.asObservable();

  userDataSourceComplete(userDataStatus: string) {
    this.userDataSource.next(userDataStatus);
  }

  private updateLoginStatus = new Subject<string>();

  updateLoginStatus$ = this.updateLoginStatus.asObservable();

  broadcastLoginStatus() {
    this.updateLoginStatus.next(this.utils.isUserLoggedIn().toString());
  }


  private lineCountUpdate = new Subject<number>();

  lineCountUpdated$ = this.lineCountUpdate.asObservable();

  broadcastLineCountUpdate() {
    this.lineCountUpdate.next();
  }

  private lineNumbers = new Subject<number>();

  lineNumbers$ = this.lineNumbers.asObservable();

  broadcastLineNumbers(lines: any) {
    this.lineNumbers.next(lines);
  }


   private resetLineNumbers = new Subject<number>();

	  resetLineNumbers$ = this.resetLineNumbers.asObservable();

	  broadcastResetLineNumbers$(lines: any) {
	    this.resetLineNumbers.next(lines);
	}



   private saveLineNumbers = new Subject<number>();

  saveLineNumbers$ = this.saveLineNumbers.asObservable();

  broadcastSaveLineNumbers(lines: any) {
    this.saveLineNumbers.next(lines);
  }

  private clearLineNumbers = new Subject<number>();

  clearLineNumbers$ = this.clearLineNumbers.asObservable();

  broadcastClearLineNumbers(lines: any) {
    this.clearLineNumbers.next(lines);
  }

  private enableEditOption = new Subject<number>();

  enableEditOption$ = this.enableEditOption.asObservable();

  broadcastEnableEditOption(lineindex: any) {
    this.enableEditOption.next(lineindex);
  }

  private enableSaveNumbers = new Subject<number>();

  enableSaveNumbers$ = this.enableSaveNumbers.asObservable();

  broadcastEnableSaveNumbers(lineindex: any) {
    this.enableSaveNumbers.next(lineindex);
  }


  private calculatePrize = new Subject<number>();

  calculatePrize$ = this.calculatePrize.asObservable();

  broadcastCalculatePrize(obj: any) {
    this.calculatePrize.next(obj);
  }


  private saveOnQuickPick = new Subject<number>();

  saveOnQuickPick$ = this.saveOnQuickPick.asObservable();

  broadcastSaveOnQuickPick(lineindex: any) {
    this.saveOnQuickPick.next(lineindex);
  }


  private chooseLinesType =  new Subject<number>();

  chooseLinesType$ = this.chooseLinesType.asObservable();

  broadcastChooseLinesType(flag: any) {
    this.chooseLinesType.next(flag);
  }


   private updateUpcomingDrawsData =  new Subject<number>();

  updateUpcomingDrawsData$ = this.updateUpcomingDrawsData.asObservable();

  broadcastUpdateUpcomingDrawsData(flag: any) {
    this.updateUpcomingDrawsData.next(flag);
  }

  private updateUpcomingBingoRooms =  new Subject<number>();

  updateUpcomingBingoRooms$ = this.updateUpcomingBingoRooms.asObservable();

  broadcastUpdateUpcomingBingoRooms(flag: any) {
    this.updateUpcomingBingoRooms.next(flag);
  }

  private updateBingoRoomsHighlightTimer =  new Subject<number>();

  updateBingoRoomsHighlightTimer$ = this.updateBingoRoomsHighlightTimer.asObservable();

  broadcastBingoRoomsHighlightTimer(flag: any) {
    this.updateBingoRoomsHighlightTimer.next(flag);
  }

  private bannerDataAvailable =  new Subject<number>();

 bannerDataAvailable$ = this.bannerDataAvailable.asObservable();

 broadcastbannerDataAvailable(flag: any) {
   this.bannerDataAvailable.next(flag);
 }

  private purchaseLoaderEvent =  new Subject<number>();

  purchaseLoaderEvent$ = this.purchaseLoaderEvent.asObservable();

  broadcastPurchaseLoaderEvent(flag: any) {
    this.purchaseLoaderEvent.next(flag);
  }

  private cancelPurchaseLoaderEvent =  new Subject<number>();

  cancelPurchaseLoaderEvent$ = this.cancelPurchaseLoaderEvent.asObservable();

  broadcastCanclePurchaseLoaderEvent(flag: any) {
    this.cancelPurchaseLoaderEvent.next(flag);
  }

  private enablePurchaseLoaderEvent =  new Subject<number>();

  enablePurchaseLoaderEvent$ = this.enablePurchaseLoaderEvent.asObservable();

  broadcastEnablePurchaseLoaderEvent(flag: any) {
    this.enablePurchaseLoaderEvent.next(flag);
  }

  private docUploadedEvent =  new Subject<number>();

  docUploadedEvent$ = this.docUploadedEvent.asObservable();

  broadcastdocUploadedEvent(flag: any) {
    this.docUploadedEvent.next(flag);
  }

  private accordianClickEvent =  new Subject<number>();

  accordianClickEvent$ = this.accordianClickEvent.asObservable();

  broadcastAccordianClickEvent(flag: any) {
    this.accordianClickEvent.next(flag);
  }

  private showSmallFooterEvent =  new Subject<string>();

  showSmallFooterEvent$ = this.showSmallFooterEvent.asObservable();

  broadcastShowSmallFooterEvent(flag: any) {
    this.showSmallFooterEvent.next(flag);
  }

  private showGameHeaderEvent =  new Subject<string>();

  showGameHeaderEvent$ = this.showGameHeaderEvent.asObservable();

  broadcastShowGameHeaderEvent(flag: any) {
    this.showGameHeaderEvent.next(flag);
  }

  private backClickedInCashier =  new Subject<string>();

  backClickedInCashier$ = this.backClickedInCashier.asObservable();

  broadcastbackClickedInCashier(flag: any) {
    this.backClickedInCashier.next(flag);
  }

  private loadHomeBanner =  new Subject<string>();

  loadHomeBanner$ = this.loadHomeBanner.asObservable();

  broadcastLoadHomeBanner() {
    this.loadHomeBanner.next();
  }


private qDResponse =  new Subject<any>();

  qDResponse$ = this.qDResponse.asObservable();

  broadcastqDResponse(resp) {
    this.qDResponse.next(resp);
  }

}
