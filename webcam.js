export class Webcam {
    constructor(canvasWidth, canvasHeight, camWidth, camHeight) {
        const that = this;
        this.frontArr = [];
        this.backgroundArr = [];

        this.canvas = document.createElement("canvas");
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        this.ctx = this.canvas.getContext('2d');
        
        this.camVideo = document.createElement("video");
        this.camVideo.autoplay = true;
        this.camVideo.width = camWidth;
        this.camVideo.height = camHeight;

        this.isPlay = null;

        navigator.getUserMedia({
            video: {
                width : camWidth,
                height : camHeight
            }
        }, function(stream) {
            that.camVideo.srcObject = stream;
            that.camVideo.onplay = function() {
                that.isPlay = true;
                that.draw();
            }
            that.camVideo.play();
        }, function(e) {
            console.log(e)
        });
    }
    draw() {
        this.ctx.globalAlpha = 1;
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(
            this.camVideo, 
            -(this.canvas.width - (this.camVideo.width * (this.canvas.height / this.camVideo.height))) / 2,
            0, 
            - (this.camVideo.width * (this.canvas.height / this.camVideo.height)), 
            this.canvas.height
        );
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        
        for (let i = 0; i < this.frontArr.length; i++) {
            if(this.frontArr[i].opacity) {
                this.ctx.globalAlpha = this.frontArr[i].opacity;
            }
            else {
                this.ctx.globalAlpha = 1;
            }
            this.ctx.drawImage(
                this.frontArr[i].img, 
                this.frontArr[i].x,
                this.frontArr[i].y,
                this.frontArr[i].width,
                this.frontArr[i].height,
            )
        }

        if(this.isPlay) {
            requestAnimationFrame(this.draw.bind(this));
        }
    }
    restart() {
        this.isPlay = true;
        this.draw();
    }
    stop() {
        this.isPlay = false;
    }
    remove() {
        this.isPlay = false;
        this.camVideo.remove();
        this.camVideo = undefined;
        this.canvas.remove();
        this.canvas = undefined;
        this.ctx = undefined;
    }
    setFront(arr) {
        if(!Array.isArray(arr)) { console.log("this is not arr"); return; }
        this.frontArr = arr;
    }
    setBackground(arr) {
        if(!Array.isArray(arr)) { console.log("this is not arr"); return; }
        this.backgroundArr = arr;
    }
}