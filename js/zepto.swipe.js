(function(root, $, factory){

	if(typeof define === 'function' && define.cmd){
		define(function(require, exports, module){
			module.exports = factory();
		});
	}
	else{
		root.Swipe = factory();
	}
})(window, Zepto, function(){
	var android = navigator.userAgent.toLowerCase().search('android 2.3.6');
	var type = android?'margin-left':'translate';

	function Swipe(container, opts){
		this.config = $.extend({}, Swipe.config, opts);
		this.container = $(container);

		this.modules = [];
		this.index = 0;
		this.getEelements();

		this.itemsLength = this.items.length;

		if(!this.config.btnList){
			return;
		}
		else{
			this.getBtnBar();
		}
		
		this.init.apply(this, arguments);
	}
	Swipe.prototype = {
		init: function(){
			this.addEvents(this);
		},
		getEelements: function(){
			this.list = this.container.find(this.config.list);
			this.items = this.list.children();

			this.removeText();
		},
		removeText: function(){
			this.list.contents().filter(function(){
				if(this.nodeType === 3)return this;
			}).remove();
		},
		addEvents: function(swipe){
			this.container.swipeLeft($.proxy(this.swipeLeft, this));
			this.container.swipeRight($.proxy(this.swipeRight, this));

			this.container.on('touchmove', function(e){
				e.preventDefault();
			});

			if(this.btns && this.btns.length>0){
				this.btns.click(function(){
					swipe.tab( $(this).index() );
				});
			}
		},
		swipeLeft: function(){
			if(this.index === this.itemsLength - 1){
				return false;
			}
			else{
				this.index++;
			}
			this.tab();
		},
		swipeRight: function(){
			if(this.index === 0){
				return false;
			}
			else{
				this.index--;
			}
			this.tab();
		},
		tab: function(index){
			if(index>-1)this.index = index;

			var j = {};
			j[type] = -this.index*100+'%';
			this.list.animate(j, 200);

			if(this.modules.length>0){
				var swipe = this;

				$.each(this.modules, function(){
					this.call(swipe);
				});
			}
		},
		getBtnBar: function(){
			this.btnList = this.container.find(this.config.btnList);
			this.btns = this.btnList.children();

			this.modules.push(function(){
				this.btns.removeClass(this.config.btnActiveClass);
				this.btns.eq(this.index).addClass(this.config.btnActiveClass);
			});
		},
		query: function(querys){
			var swipe = this;

			var query = function(){
				var cw = swipe.container.width();
				var result = querys[0];

				$.each(querys, function(){
					var q = this;
					if( eval(cw+q.width) ){
						result = q;
					}
				});
				swipe.items.each(function(){
					var item = $(this);

					item.css('background-image', 'url('+result.directory+item.attr(result.name)+result.type+')');
				});
			}

			$(window).resize(query).trigger('resize');
		}
	};
	Swipe.config = {
		list: '.list',
		btnList: '.btn-list',
		btnActiveClass: 'active'
	};

	return Swipe;

});