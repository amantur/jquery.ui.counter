(function($, undefined){
	$.widget("ui.counter",{
		options:{
		  imageUrl:'counter.gif'
		  , imgWidth:'12'
		  , numHeight:'18'
		  , duration:500
		  , number:0
		},
		_create: function(){
			var self = this, 
				o = self.options,
				el = self.element;
			o.numHeight=o.numHeight.replace(/[a-z]/ig,'');	
			o.imgWidth=o.imgWidth.replace(/[a-z]/ig,'');

			o.number=this._addCommas(o.number);
			
			el.addClass("ui-widget ui-counter").css({
				width:'auto',
				height:o.numHeight+'px',
				overflow:'hidden',
				position:'relative'
			});

			this.changing=false;
			this.change(o.number);

			$.ui.counter.instances.push(this.element);

			if(!String.prototype.format && (typeof String.prototype.format !== "function")){
				String.prototype.format = function() {
					var s = this,
						i = arguments.length;
					while (i--) {
						s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
					}
					return s;
				};
			}
			return this;
		},
		_init: function(){
			this._addImages();
			this._animate();
		},
		destroy: function(){
			var element = this.element,
			position = $.inArray(element, $.ui.counter.instances);

			if(position > -1){
				$.ui.counter.instances.splice(position, 1);
			}

			$.Widget.prototype.destroy.call( this );
		},
		getNumber: function(){
			return this.options.number;
		},
		change: function(newNumber){
			if(this.changing===true)return;
			var n=this._addCommas(newNumber);
			//if(n===this.options.number) return;
			this.options.number = n; //store for later ref.
			this.changing=true;
			if(n.length!==this.options.number) {
				//if lenghts of numbers are not same then remove and add images again.
				this._addImages();
			}
			//this.change images to reflect new number
			this._animate();
			this.changing=false;
		},
		_addImages: function(){
			var imgs=[], o=this.options;
			var nums=o.number.toString(),l=nums.length;
			for(var i=0;i<l;i++){
				imgs.push("<img src='counter_bg.gif' alt='' class='ui-counter-num' style='position:relative;float:left;top:0px;padding:0px;margin:0px;border:0px;width:" + o.imgWidth + "px!important;'data-num='" + nums.charAt(i) + "'/>");
			}
			$(this.element).find("img.ui-counter-num").remove();
			this.element.append(imgs.join(''));
		},
		_animate: function(){
			var $ig, n=0, h=0, options=this.options;
			$.each($("img.ui-counter-num",this.element), function(idx, image){
				$ig=$(image);
				n=$ig.data("num");
				if(n===','){
					n=10;
				}
				h=n*options.numHeight;
				if(h!==NaN){
					$ig.animate({top:"-="+ h +"px"}, {duration:options.duration, easing:'easeInOutCirc'});
				}
			});
		},
		_setOption: function(key,value){
			this.options[key]=value;
		},
		_addCommas: function(nStr){
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		}
	});

	$.extend($.ui.counter, {
		instances: []		
	});
})(jQuery);
