app.addModule('calendar', function () {
	this.init = function () {
		$('.calendar_current').click(function () {
			$(this).closest('.calendar').toggleClass('active')
		})
	};
});
app.addModule('data-table', function () {
	this.init = function () {
		$('.data-table_head').click(function () {
			$(this).closest('.data-table_item').toggleClass('active');
			
			$('.data-table-popup').addClass('active');
			
			fillData($(this).closest('.data-table_item'));
		});
		
		$('.data-table-popup_back').click(function () {
			$('.data-table-popup').removeClass('active');
		});
	};
	
	function fillData(table) {
		var popupTable = $('.data-table-popup');
		var head = popupTable.find('.data-table_head');
		
		head.html(table.find('.data-table_head h3').clone());
		
		$('.data-table-popup_body').html('');
		
		table.find('.data-table_row').each(function () {
			var _ = $(this);
			var row = $('<a />').addClass('data-table-popup_row');
			var teams = $('<div />').addClass('data-table-popup_teams');
			var results = $('<div />').addClass('data-table-popup_results');
			var result1 = $('<div />').addClass('data-table-popup_result');
			var result2 = $('<div />').addClass('data-table-popup_result');
			var time = $('<div />').addClass('data-table-popup_time');
			var info = $('<div />').addClass('data-table-popup_info');
			
			row.attr('href', _.attr('href'));
			
			teams.html(_.find('.data-table_team').clone());
			result1.html(_.find('.data-table_result strong:first-child').html());
			result2.html(_.find('.data-table_result strong:last-child').html());
			time.html(_.find('.data-table_time').clone());
			info.html(_.find('.data-table_info').clone());
			
			results.append(result1, result2);
			row.append(teams, results, time, info);
			
			$('.data-table-popup_body').append(row);
		});
	}
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
		var list = $('.res_listк');

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
