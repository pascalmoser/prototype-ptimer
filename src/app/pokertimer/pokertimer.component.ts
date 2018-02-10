import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';


@Component({
    selector: 'app-pokertimer',
    templateUrl: './pokertimer.component.html',
    styleUrls: ['./pokertimer.component.scss']
})
export class PokertimerComponent implements OnInit {

    ticks = 0;
    minutesDisplay: number = 0;
    secondsDisplay: number = 0;

    timer: Subscription;

    timerState = {
        on: false,
        pausedTicks: 0
    };

    gameSchedule = [
        { smallblind:50, bigblind:100, playtime:0.5, breaktime:5 },
        { smallblind:100, bigblind:200, playtime:0.5, breaktime:5 },
        { smallblind:200, bigblind:400, playtime:0.5, breaktime:5 },
        { smallblind:400, bigblind:800, playtime:45, breaktime:5 },
        { smallblind:800, bigblind:1600, playtime:60, breaktime:5 },
        { smallblind:1600, bigblind:3200, playtime:60, breaktime:0 }
    ];

    game = {
        state: 'pause', // play, pause, timeout
        smallBlind: this.gameSchedule[0].smallblind,
        bigBlind: this.gameSchedule[0].bigblind,
        playTime: this.gameSchedule[0].playtime,
        breakTime: 0,
        scheduleIndex: 0,
        onBreakTime: false
    };

    constructor() {

    }

    ngOnInit() {
        // this.startTimer(120);
    }

    private toggleTimer(forcePlay) {
        if(this.timerState.on !== true || forcePlay === true) {
            this.game.state = 'play';
            this.timerState.on = true;
            this.playTimer();
        } else {
            this.game.state = 'pause';
            this.timerState.on = false;
            this.pauseTimer();
        }
    }

    private playTimer() {
        if(this.game.scheduleIndex === 0) {
            this.scheduler();
        } else {
            console.log('play');
            // this.startTimer(5); //todo ??
        }
    }

    private scheduler() {
        if(this.game.breakTime > 0 && !this.game.onBreakTime) {
            console.log('break');
            this.breakTime();
        } else {
            this.game.onBreakTime = false;
            this.game.smallBlind = this.gameSchedule[this.game.scheduleIndex].smallblind;
            this.game.bigBlind = this.gameSchedule[this.game.scheduleIndex].bigblind;
            this.game.breakTime = this.gameSchedule[this.game.scheduleIndex].breaktime;
            this.startTimer(this.gameSchedule[this.game.scheduleIndex].playtime);
            this.game.scheduleIndex++;
            this.toggleTimer(true);
        }
    };

    private timeOut() {
        if(this.game.state !== 'timeout') {
            this.game.state = 'timeout';
            this.startTimer(0.15);
            console.log('timeout');
        } else {
            this.scheduler();
        }
    }

    private breakTime() {
        this.startTimer(this.game.breakTime);
        this.game.state = 'pause';
        this.game.onBreakTime = true;
        console.log('breaktime');
    };

    private startTimer(minutes) {

        let _ = this,
            timer = Observable
            .timer(1000, 1000)
            .map(i => minutes * 60 - i)
            .take(minutes * 60 + 1);

        this.timer = timer.subscribe(
            t => {
                this.ticks = t;

                this.secondsDisplay = this.getSeconds(this.ticks);
                this.minutesDisplay = this.getMinutes(this.ticks);
            }, function (e) {
                console.log(e);
            }, function () {
                console.log('timer finish');
                _.timeOut();
            }
        );
    }

    private pauseTimer() {
        this.timerState.pausedTicks = this.ticks;
        this.timer.unsubscribe();
    }

    private stopTimer() {
        this.timer.unsubscribe();
    }

    private getSeconds(ticks: number) {
        return this.pad(ticks % 60);
    }

    private getMinutes(ticks: number) {
        return this.pad((Math.floor(ticks / 60)));
    }

    private pad(digit: any) {
        return digit <= 9 ? '0' + digit : digit;
    }

}
