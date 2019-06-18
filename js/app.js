app.addModule('calendar', function () {
	this.init = function () {
		$('.calendar_current').click(function () {
			$(this).closest('.calendar').toggleClass('active')
		})
	};
});
app.addModule('data-table', function () {
	var self = this;
	
	this.init = function () {
		$('.data-table_close').click(function () {
			$(this).closest('.data-table_item').toggleClass('active');
			
			$('.data-table-popup').addClass('active');
		});
		
		withoutPopup();
	};
	
	function withoutPopup(command) {
		if (!command) {
			command = $('.data-table_command')
		}
		
		command.each(function () {
			var command = $('<div />').addClass('data-table_command-mobile');
			
			$(this).after(command);

			$(this).find('.data-table_row').each(function () {
				var _ = $(this);
				var row = $('<a />').addClass('data-table-popup_row');
				var started = _.attr('data-active') === 'true';
				var hasScore = _.attr('data-score') === 'true';

				var teams = $('<div />').addClass('data-table-popup_teams');
				var cnt = $('<div />').addClass('data-table-popup_cnt');
				var results = $('<div />').addClass('data-table-popup_results');
				var result1 = $('<div />').addClass('data-table-popup_result');
				var result2 = $('<div />').addClass('data-table-popup_result');
				var time = $('<div />').addClass('data-table-popup_time');

				row.attr('href', _.attr('href'));

				teams.html(_.find('.data-table_team').clone());
				result1.html(_.find('.data-table_result strong:first-child').html());
				result2.html(_.find('.data-table_result strong:last-child').html());
				time.html(_.find('.data-table_time').clone());
				cnt.html(_.find('.data-table_cnt').clone());

				results.append(result1, result2);
				row.append(teams, cnt, results, time);

				command.append(row);

				if (started) {
					time.removeClass('active');
					cnt.addClass('active');
				} else {
					time.addClass('active');
					cnt.removeClass('active');
				}
				
				if (hasScore) {
					results.addClass('active');
				} else {
					results.removeClass('active');
				}

				if (_.find('.data-table_result').hasClass('__online')) {
					result1.addClass('__online');
					result2.addClass('__online');
				} else {
					result1.removeClass('__online');
					result2.removeClass('__online');
				}
			});
			
			var link = $(this).find('.link-block');
			
			if (link.length) {
				command.append(link.clone())
			}
		});
	}
	
	this.reset = function (item) {
		item.find('.data-table_command-mobile').remove();
		
		withoutPopup(item.find('.data-table_command'));
	};
	
	this.updateMobile = function () {
		$('.data-table_command-mobile').remove();
		
		withoutPopup();
	};
	
	window.updateMobileDataTable = function () {
		self.updateMobile();
	}
});
app.addModule('datepicker', function () {
	var self = this;
	
	var datepicker;
	var eventDates = [];
	var initialized = false;

	this.init = function () {
		datepicker = window.datepicker = $('#datepicker').datepicker({
			onRenderCell: function (date, cellType) {
				var currentDate = date.getDate();

				if (cellType == 'day' && eventDates.indexOf(currentDate) != -1) {
					return {
						html: '<div class="dp-day">' + currentDate + '<span class="dp-note"></span></div>'
					}
				}
			},
			onChangeView: function (view) {
				if (view === 'days') {
					self.changeData();
				}
			},
			onChangeMonth: function (month, year) {
				self.changeData();
			},
			onSelect: function (formattedDate, date, inst) {
				if (initialized) {
					if (!date) {
						date = new Date(Date.parse($('#datepicker').attr('data-selected-day')));
					}
					
					self.onSelect(getFormattedDate(date));
				}
				initialized = true;
			}
		}).data('datepicker');
		
		self.changeData();
		var selectedDate = $('#datepicker').attr('data-selected-day');
		datepicker.selectDate(new Date(Date.parse(selectedDate)));
	};

	this.update = function () {
		datepicker.update();
	};
	
	this.changeData = function () {
		var date = datepicker.date;
		var currentMonth = date.getMonth() + 1;
		
		// используя ajax получить все дни, в которых есть матчи
		// после загрузки добавить их в массив eventDates, значения от 1 до 31
		// в переменной currentMonth находится текущий месяц от 1 до 12
		// вызвать self.update();
		eventDates = [1, 2, 5, 7];
		self.update();
	};
	
	this.onSelect = function (date) {
		// либо использовать 
		// var url = location.protocol + "//" + location.hostname + '/?day=' + date;
		var url = 'https://ft-s.roscontent.ru/?day=' + date;
		
		location.href = url;
	};
});
	
function getFormattedDate(date) {
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	
	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	
	return year + '-' + month + '-' + day;
}
app.addModule('news-slider', function () {
	this.init = function () {
		$('.news-slider').slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 5000,
			arrows: false,
			dots: true,
			infinite: false,
			
			responsive: [
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 1
					}
				}
			]
		});
	};
});
app.addModule('res-tab', function () {
	this.init = function () {
		$('.res-tab_calendar-item a').click(function (e) {
			e.preventDefault();
			
			$(this).closest('.res-tab_calendar-item').toggleClass('active');
		});
		
		$('.res-tab_head-list a').click(function (e) {
			e.preventDefault();
			
			if ($(this).closest('.res-tab_calendar-item').length) {
				return;
			}
			
			var block = $($(this).attr('href'));
			
			$('.res-tab_block').removeClass('active');
			block.addClass('active');
			
			$('.res-tab_head-list li').removeClass('active');
			$(this).closest('li').addClass('active');
		})
	};
});
app.addModule('res', function () {
	this.init = function () {
		var list = $('.res_list');

		var block = createBlock(list);

		list.after(block);
	};

	function createBlock(list) {
		var a = list.find('a');
		var selectBlock = $('<div />').addClass('mobile-select');
		var select = $('<select />').addClass('select');
		selectBlock.append(select);

		a.each(function () {
			var option = $('<option />');
			option.val($(this).attr('href')).html($(this).text());
			select.append(option);
			if ($(this).closest('li').hasClass('active')) {
				option.prop('selected', true);
			}
		});

		select.on('change', function () {
			location.href = $(this).find('option:selected').val();
		});

		return selectBlock;
	}
});
