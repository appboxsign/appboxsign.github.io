var app = new Framework7({
  root: '#app',
  name: 'AppsCloud',
  id: 'me.appscloud.app',
  routes: routes,
  theme: 'ios',
  language: 'ru',
  statusbar: {
    iosOverlaysWebView: true,
  },
  navbar: {
	  scrollTopOnTitleClick: false,
  },
  dialog: {
	  buttonCancel: 'Закрыть'
	}
});

var panel = app.panel.create({
  el: '.panel-left',
  visibleBreakpoint: 1024,
});

var $$ = Dom7;

var mainView = app.views.create('.view-main', {
	url: '/home/',
});
var deviceView = app.views.create('.view-device', {
	url: '/device/'+localStorage['device_id']+'/',
});
var settingsView = app.views.create('.view-settings', {
	url: '/settings/',
});
    
$$(document).on('page:init', '.page[data-name="home"]', function (e) {
    
    $$('.app-view-link').on('click', function () {
	    mainView.router.navigate('/app/' + $$(this).data('app-id') + '/' + localStorage['device_id'] + '/', {
		  ignoreCache: true,
		});
    });
    
    $$('#home-ptr.ptr-content').on('ptr:refresh', function (e) {
		mainView.router.navigate(mainView.router.currentRoute.url, {
		  reloadCurrent: true,
		  ignoreCache: true,
		  clearPreviousHistory: true,
		});
	});
});

$$(document).on('page:init', '.page[data-name="app-page"]', function (e) {
	var swipeToClosePopup = app.popup.create({
	  el: '.demo-popup-swipe-handler',
	  swipeToClose: 'to-bottom',
	  swipeHandler: '.swipe-handler',
	});
	
	$$('.navbar-install').on('click', function (){
		$$('.install-btn').click();
	});
	
	$$('.install').on('click', function () {
	  switch ($$(this).data('status')) {
		  case '0':
		    app.dialog.alert( 'Для начала необходимо добавить устройство в разделе "Усторойство"' );
		    break;
		  case '1':
		    app.dialog.alert( 'Для установки приложения необходимо олатить активацию устройства в разделе "Устройство"' );
		    break;
		  case '2':
		    app.dialog.alert( 'Устройство находится в процессе активации' );
		    break;
		  default:
		    app.dialog.alert( "Неизвестная ошибка" );
		}
  });
    
  $$('.view-photo-img').on('click', function () {
		var photos = JSON.parse($$('#photos-array').data('photos'));
		console.log(photos);
		photos.forEach(function(photo, i, photos) {
			photos[i] = '/files/apps/icons/' + photo;
		});
		var myPhotoBrowserStandalone = app.photoBrowser.create({
		    photos : photos,
		    popupCloseLinkText: '<i class="icon f7-icons if-not-md normal">multiply</i>',
		    navbarOfText: 'of',
		    swiper: {
			    mousewheel:{
				    forceToAxis:true,
				    invert:true
				  },
				  keyboard: {
				    enabled: true,
				    onlyInViewport: false,
				  }
		    }
		});
		myPhotoBrowserStandalone.activeIndex = Number($$(this).data("item-num"));
		myPhotoBrowserStandalone.open();
		myPhotoBrowserStandalone.expositionToggle();
	});
    
  $$('.app-description a').addClass("external");
});

$$(document).on('page:init', '.page[data-name="device"]', function (e) {
	$('.pay-timeago').timeago();
	
	var swipeToClosePopup = app.popup.create({
	  el: '.demo-popup-swipe-handler',
	  swipeToClose: 'to-bottom',
	  swipeHandler: '.swipe-handler',
	});
	
	$$('#device-ptr.ptr-content').on('ptr:refresh', function (e) {
		deviceView.router.navigate(deviceView.router.currentRoute.url, {
		  reloadCurrent: true,
		  ignoreCache: true,
		  clearPreviousHistory: true,
		});
	});
	
	$$('.add-device').on('click', function(){
		var udid = $$( "input[name=udid]" ).val();
		if (udid !== ''){
			app.request.post('/app/index/add_device/', { udid:udid }, function (data) {
				if (!JSON.parse(data).status){
					app.dialog.alert('Убедитесь, что Вы указали корректный UDID.<br> Если UDID указан верно, нажмите кнопку "Узнать свой UDID" и повторите процедуру установки профиля', 'Ошибка');
				} else {
					localStorage['device_id'] = JSON.parse(data).device.id;
					deviceView.router.navigate('/device/'+localStorage['device_id']+'/', {
					  reloadCurrent: true,
					  ignoreCache: true,
					  clearPreviousHistory: true,
					});
				}
			});
		}
	});
	
	$$('.pay-activation').on('click', function () {
	  var device_id = localStorage['device_id'];
	  var rand = Math.floor(Math.random() * 10000) + 1;
	  app.dialog.create({
	    title: 'Предупреждение о рисках',
	    text: 'Данная услуга основана на обходе правил Apple, в отношении их политики распространения приложений. Поэтому Apple может приостановить работу приложений раньше положенного срока (1 год). Подробнее об этом в <a class="link" onclick="openTerms()">правилах сервиса</a>',
	    buttons: [
	      {
	        text: '<a href="/app/index/pay_device/'+ device_id +'?p='+ rand +'" class="link external" style="width:100%">Оплатить активацию</a>',
	        bold: true,
	      },
	      {
	        text: 'Отмена',
	      },
	    ],
	    verticalButtons: true,
	  }).open();
	});
	
	$$('.download-cert').on('click', function () {
		var stream = $$(this).data('stream');
		app.dialog.create({
		    title: 'Ссылка на скачивание',
			text: 'Скопируйте ссылку и скачайте сертификат на компьютер. <br>Не забудте прочитать инструкцию перед скачиванием!',
		    content: '<div class="dialog-input-field input"><input type="text" class="dialog-input" value="https://appscloud.me/certifiget/'+stream+'"></div>',
		    buttons: [
			  	{
		        text: 'Инструкция',
		        bold: true,
		        onClick: function (){
			        deviceView.router.navigate('/news/3/', {
							  ignoreCache: true,
							});
		        }
		      },
		      {
		        text: 'Закрыть',
		      },
		    ],
		    verticalButtons: true,
	  	}).open();
	});
	
	$$('.copy-udid').on('click', function () {
		var udid = $$('#device-udid').html();
		app.dialog.create({
		    title: 'UDID',
		    content: '<div class="dialog-input-field input"><input type="text" class="dialog-input" value="'+udid+'"></div>',
		    buttons: [
		      {
		        text: 'Закрыть',
		      },
		    ],
		    verticalButtons: true,
	  	}).open();
	});
	
	$$('.open-partner').on('click', function (){
		if (localStorage['partner_code'] == undefined){
			deviceView.router.navigate('/partner/');
		} else {
			deviceView.router.navigate('/partner_panel/'+localStorage['partner_code']+'/');
		}
	});
	
});

$$(document).on('page:init', '.page[data-name="settings"]', function (e) {
	var toggle = app.toggle.create({
	  el: '.toggle',
	});
	if (localStorage['layout'] == 'dark'){
		$$('html').addClass("theme-dark");
		toggle.toggle();
	}
	$$('.theme-toggle').on('change', function(){
		var toggle = app.toggle.get('.toggle');
		if (toggle.checked) {
			localStorage['layout'] = 'dark';
			$$('html').removeClass("theme-dark").addClass("theme-dark");
		} else {
			localStorage['layout'] = 'light';
			$$('html').removeClass("theme-dark");
		}
	});
});

$$(document).on('page:init', '.page[data-name="news"]', function (e) {
	$$('.news-text a').addClass("external");
	$$('.news-text a.link').removeClass("external");
});

$$(document).on('page:init', '.page[data-name="partner"]', function (e) {
	$$('.partner-code-btn').on('click', function () {
		app.dialog.prompt(
			"",
			"Введите код доступа",
			function (code) {
				checkCode(code);
			}
		);
	});
	
	$$('.partner-contact-btn').on('click', function () {
		app.dialog.create({
	    title: 'Партнерское соглашение',
	    text: 'Нажимая "Далее", Вы подтверждаете, что ознакомились с Партнерским Соглашением и принимаете его.',
	    buttons: [
		    {
	        text: 'Партнерское соглашение',
	        onClick: function (){
		        app.dialog.close();
		        deviceView.router.navigate('/partnership_agreement/');
	        }
	      },
	      {
	        text: '<a href="https://ttttt.me/@eliseyd" class="link external" style="width:100%">Далее</a>',
	        bold: true,
	      },
	      {
	        text: 'Закрыть',
	      },
	    ],
	    verticalButtons: true,
	  }).open();
	});
});

$$(document).on('page:init', '.page[data-name="partner-panel"]', function (e) {
	$$('#partner-panel-ptr.ptr-content').on('ptr:refresh', function (e) {
		deviceView.router.navigate(deviceView.router.currentRoute.url, {
		  reloadCurrent: true,
		  ignoreCache: true,
		});
	});
	
	$$('.partner-code-btn').on('click', function () {
		app.dialog.prompt(
			"",
			"Введите код доступа",
			function (code) {
				checkCode(code);
			}
		);
	});
});

function checkCode(code){
	app.request.post('/app/index/partner_code/', { code:code }, function (data) {
		if (!JSON.parse(data).status){
			app.dialog.alert('Указан неверный код доступа', 'Ошибка');
		} else {
			localStorage['partner_code'] = code;
			deviceView.router.navigate('/partner_panel/'+localStorage['partner_code']+'/', {
			  reloadCurrent: true,
			  ignoreCache: true,
			  clearPreviousHistory: true,
			});
		}
	});
}

function openTerms(){
	app.popup.close();
	app.dialog.close();
	deviceView.router.navigate('/terms/');
}

function openPage(path){
	app.popup.close();
	app.dialog.close();
	deviceView.router.navigate(path);
}

function imgDeviceError(image){
	image.onerror = "";
  image.src = "/client/img/device/devices/undefinedDevice.png";
  return true;
}