function Progress(init, total, step, delay) {
    this._current = typeof init !== 'undefined' ? init : 0;
    this._total = typeof total !== 'undefined' ? total : 100;
    this._step = typeof step !== 'undefined' ? step : 0.25;
    this._delay = typeof delay !== 'undefined' ? step : 40;
    this._ivid = null;
    this._handlers = [];
    this._status = 'stop';

    // this._ivid = setInterval(function () {
    //     if (this._current > this._total) {
    //         this.pause();
    //     }
    //     else {
    //         this.emit({'current': this._current, 'total': this._total, 'status': 'running'});
    //         this._current += this._step;
    //     }
    // }.bind(this), this._delay);

    this.watch = function (callback) {
        if (!this._handlers) {
            this._handlers = [];
        }
        this._handlers.push(callback);
    };

    this.emit = function (event) {
        if (this._handlers) {
            var __handlers = this._handlers;
            for (var i = 0; i < __handlers.length; i++) {
                __handlers[i](event);
            }
        }
    };

    this.start = function () {
        if (this._status === 'stop') {
            this._status = 'start';
            this.emit({'current': this._current, 'total': this._total, 'status': this._status});
            this._ivid = setInterval(function () {
                if (this._current > this._total) {
                    this.pause();
                }
                else {
                    this._status = 'running';
                    this.emit({'current': this._current, 'total': this._total, 'status': this._status});
                    this._current += this._step;
                }
            }.bind(this), this._delay);
        }
    };

    this.stop = function () {
        if (this._status !== 'stop') {
            this._current = 0;
            window.clearInterval(this._ivid);
            this._ivid = null;
            this._status = 'stop';
            this.emit({'current': this._current, 'total': this._total, 'status': this._status});
        }
    };

    this.pause = function () {
        if (this._status !== 'stop' && this._status !== 'pause') {
            window.clearInterval(this._ivid);
            this._status = 'pause';
            this.emit({'current': this._current, 'total': this._total, 'status': this._status});
        }
    };

    this.resume = function () {
        if (this._status === 'pause') {
            this._status = 'resume';
            this.emit({'current': this._current, 'total': this._total, 'status': this._status});
            if (this._ivid != null) {
                this._ivid = setInterval(function () {
                    if (this._current > this._total) {
                        this.pause();
                    }
                    else {
                        this._status = 'running';
                        this.emit({'current': this._current, 'total': this._total, 'status': this._status});
                        this._current += this._step;
                    }
                }.bind(this), this._delay);
            }
        }
    };

    this.seek = function (orgin) {
        this._current = orgin > this._total ? this._total : orgin < 0 ? 0 : orgin;
        this.emit({'current': this._current, 'total': this._total, 'status': 'seek'});
    };

    this.seekP = function (percent) {
        var per = percent > 100 ? 100 : percent < 0 ? 0 : percent;
        this._current = (per / 100) * this._total
        this.emit({'current': this._current, 'total': this._total, 'status': 'seekP'});
    }
}

// var prog = new Progress(init = 5, total = 100, step = 1.25, delay = 40);
// prog.watch(function (event) {
//     if (event.status !== 'running')
//         console.log(JSON.stringify(event));
//     else
//         console.log(event.current / event.total);
// });