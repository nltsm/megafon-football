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
app.addModule('fine-list', function () {
	this.init = function () {
		$(document).on('click', '.fine-list_head', function () {
			$(this).toggleClass('active');
			$(this).closest('.fine-list_item').find('.fine-list_hidden').toggleClass('active');
		});
	};
});
app.addModule('fine', function () {
	var stsValidated = false;
	var numberVuValidated = false;

	window.fineFormValidated = function () {
		return stsValidated && numberVuValidated;
	};

	this.init = function () {
		$('#number-sts').on('keyup input change', function () {
			var val = $(this).val();
			
			if (val.length > 17) {
				val = val.substring(0, 17);
			}
			
			$(this).val(val);
			
			checkSts($(this).val());
		});

		$('#number-vu').on('keyup input change', function () {
			var val = $(this).val();
			
			if (val.length > 10) {
				val = val.substring(0, 10);
			}
			
			$(this).val(val);
			
			checkVu($(this).val());
		});

		$('.fine_btn').on('click', function () {
			checkSts($('#number-sts').val());
			checkVu($('#number-vu').val());
		});
		
		$('#unpayed').on('change', function () {
			var showOnlyUnpayed = $(this).prop('checked');
			
			if (showOnlyUnpayed) {
				$('.fine-list_item[data-payed=true]').addClass('__hidden-payed');
			} else {
				$('.fine-list_item[data-payed=true]').removeClass('__hidden-payed');
			}
		});
	};

	function checkSts(val) {
		var rgx = /^[0-9A-Za-z]{17}$/;
		var input = $('#number-sts');

		if (val.match(rgx)) {
			input.removeClass('__error');
			input.next().removeClass('__error');
			stsValidated = true;
		} else {
			input.addClass('__error');
			input.next().addClass('__error');
			stsValidated = false;
		}
	}

	function checkVu(val) {
		var rgx = /^[0-9]{10}$/;
		var input = $('#number-vu');
		if (val.match(rgx)) {
			input.removeClass('__error');
			input.next().removeClass('__error');
			numberVuValidated = true;
		} else {
			input.addClass('__error');
			input.next().addClass('__error');
			numberVuValidated = false;
		}
	}
});
app.addModule('news-slider', function () {
	this.init = function () {
		$('.news-slider').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 5000
		});
	};
});
app.addModule('res-tab', function () {
	this.init = function () {
		$('.res-tab_head-list a').click(function (e) {
			e.preventDefault();
			
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
