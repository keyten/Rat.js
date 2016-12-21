Rat = function(context){
    this.context = context;
};
Rat.prototype = {
    path : function(opt, style){ return new Rat.Path(opt, style, this); },
    image : function(opt, style){ return new Rat.Image(opt, style, this); },
    text : function(opt, style){ return new Rat.Text(opt, style, this); },

    clear: function(){
        var cnv = this.context.canvas;
        this.context.clearRect(0, 0, cnv.width, cnv.height);
    },
    draw: function(elements){
        var ctx = this.context;
        elements.forEach(function(element){
            element.draw(ctx);
        });
    }
};
Rat.Path = function(opt, style, context){
    Rat.init(this, arguments);
};
Rat.Path.prototype = {
    draw: function(ctx){
        this.process(function(ctx){
            if(this.style.fillStyle)
                ctx.fill();
            if(this.style.strokeStyle)
                ctx.stroke();
        }, ctx);
    },
    isPointIn: function(x,y, ctx){
        return this.process(function(ctx){ return ctx.isPointInPath(x, y) }, ctx);
    },
    process: function(callback, ctx){
        ctx = ctx || this.context.context;
        Rat.style(ctx, this.style);
        ctx.beginPath();
        this.opt.forEach(function(func){
            ctx[func[0]].apply(ctx, func.slice(1));
        });
        var result = callback.call(this, ctx);
        ctx.restore();
        return result;
    }
};

Rat.Image = function(opt, style, context){
    Rat.init(this, arguments);
};
Rat.Image.prototype.draw = function(ctx){
    Rat.style(ctx, this.style);
    if(this.style.crop)
        ctx.drawImage.apply(ctx, [this.opt, 0, 0].concat(this.style.crop));
    else
        ctx.drawImage(this.opt, 0, 0, this.style.width || this.opt.width, this.style.height || this.opt.height);
    ctx.restore();
};
Rat.Text = function(){
    Rat.init(this, arguments);
};
Rat.Text.prototype.draw = function(ctx){
    Rat.style(ctx, this.style);
    if(this.style.fillStyle)
        ctx.fillText(this.opt, 0, 0, this.style.maxWidth || 999999999999999);
    if(this.style.strokeStyle)
        ctx.strokeText(this.opt, 0, 0, this.style.maxWidth || 9999999999999999);
    ctx.restore();
};
Rat.Text.prototype.measure = function(){
    var ctx = this.context.context;
    Rat.style(ctx, this.style);
    var w = ctx.measureText(this.opt).width;
    ctx.restore();
    return w;
};

Rat.notStyle = "translate0rotate0transform0scale".split(0);
Rat.style = function(ctx, style){
    ctx.save();
    style.origin && ctx.translate(style.origin[0], style.origin[1]);
    style.rotate && ctx.rotate(style.rotate);
    style.scale && ctx.scale.apply(ctx, style.scale);
    style.origin && ctx.translate(-style.origin[0], -style.origin[1]);
    style.translate && ctx.translate.apply(ctx, style.translate); // must it be before or after origin?
    style.transform && ctx.transform.apply(ctx, style.transform);
    Object.keys(style).forEach(function(key){
        if(!~Rat.notStyle.indexOf(key))
            ctx[key] = style[key];
    });
};
Rat.init = function(cls, arg){
    cls.opt = arg[0];
    cls.style = arg[1] || {};
    cls.context = arg[2];
    cls.draw(arg[2].context);
};
