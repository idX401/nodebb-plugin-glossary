'use strict';

define('admin/plugins/glossary', ['settings', 'settings/sorted-list', 'bootbox', 'benchpress'], function (settings, sortedList, bootbox, benchpress) {
	var ACP = {};

	ACP.init = function () {
		settings.load('glossary', $('.glossary-settings'));
		$('#save').on('click', saveSettings);

		$('#upload-csv').on('click', function () {
			const modal = bootbox.dialog({
				title: 'Upload CSV',
				message: '<textarea id="csv-input" class="form-control"></textarea>',
				buttons: {
					submit: {
						label: 'Add',
						className: 'btn-primary',
						callback: async function () {
							const text = modal.find('#csv-input').val();
							const lines = text.split('\n');
							// eslint-disable-next-line no-restricted-syntax
							for (const line of lines) {
								const parts = line.split(',');
								const name = parts.shift().trim();
								let description = parts.join(',').trim();
								if (description.startsWith('"') && description.endsWith('"')) {
									description = description.slice(1, -1);
								}
								if (name && description) {
									// eslint-disable-next-line no-await-in-loop
									const form = $(await benchpress.render('admin/plugins/glossary/partials/sorted-list/form', {}));
									form.find('#name').val(name);
									form.find('#description').val(description);
									sortedList.addItem(form.children(), $('[data-sorted-list="keywords"]'));
								}
							}
						},
					},
				},
			});
			return false;
		});
	};

	function saveSettings() {
		settings.save('glossary', $('.glossary-settings'), function () {
			app.alert({
				type: 'success',
				alert_id: 'glossary-saved',
				title: 'Settings Saved',
				message: 'Please reload your NodeBB to apply these settings',
				clickfn: function () {
					socket.emit('admin.reload');
				},
			});
		});
	}

	return ACP;
});
