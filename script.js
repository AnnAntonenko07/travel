$(document).ready(function () {
    // Слайдер
    let slides = $('.slide');
    let current = 0;

    function showSlide(index) {
        let slide = slides.eq(index);
        slide.css({
            left: '-100%',
            opacity: 1
        }).animate({
            left: '0%'
        }, 1000, function () {
            setTimeout(function () {
                slide.animate({
                    left: '100%'
                }, 1000, function () {
                    slide.css('opacity', 0);
                    current = (index + 1) % slides.length;
                    showSlide(current);
                });
            }, 3000);
        });
    }
    showSlide(current);
    
    // Валідація форми
    if ($('#name-error').length === 0) {
        $('input[name="name"]').after('<div id="name-error" style="color:red; font-size:12px; display:none; font-family:\'Montserrat\', sans-serif;"></div>');
    }
    if ($('#phone-error').length === 0) {
        $('input[name="phone"]').after('<div id="phone-error" style="color:red; font-size:12px; display:none; font-family:\'Montserrat\', sans-serif;"></div>');
    }
    if ($('#success-message').length === 0) {
        $('form').after('<div id="success-message" style="color:green; font-size:14px; margin-top:15px; display:none; text-align:center; font-family:\'Montserrat\', sans-serif;"></div>');
    }
    
    function validateName() {
        const name = $('#name').val().trim();
        const regex = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐʼ'-]+$/u;
        
        if (name.length < 2) {
            $('#name-error').text("Імʼя повинно містити як мінімум 2 літери").show();
            return false;
        } else if (!regex.test(name)) {
            $('#name-error').text("Імʼя може містити лише літери, апостроф і дефіс").show();
            return false;
        } else {
            $('#name-error').hide();
            return true;
        }
    }
    
    function validateEmail() {
        const email = $('#email').val().trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const forbiddenDomains = ['mail.ru', '.ru', '@.ru'];
        
        // Перевірка на заборонені домени
        const domain = email.split('@')[1];
        if (forbiddenDomains.some(forbidden => domain.includes(forbidden))) {
            $('#email-error').text('Цей домен email не підтримується').show();
            return false;
        }
        
        if (!regex.test(email)) {
            $('#email-error').text('Будь ласка, введіть коректний email').show();
            return false;
        } else {
            $('#email-error').hide();
            return true;
        }
    }
    
    $('#name').on('input', validateName);
    $('#email').on('input', validateEmail);
    
    $('#travelForm').on('submit', function (e) {
        e.preventDefault();
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
    
        if (isNameValid && isEmailValid) {
            $('#success-message').text('Запит успішно надіслано!').show();
            setTimeout(function() {
                $('#success-message').fadeOut();
            }, 3000);
        } else {
            $('#success-message').hide();
        }
    });
    
    // Обробники для модального вікна - ВИНЕСЕНО З ФОРМИ
    $('.author-link').click(function(e) {
        e.preventDefault();
        $('#authorModal').fadeIn();
    });

    $('.close').click(function(e) {
        e.preventDefault();
        $('#authorModal').fadeOut();
    });

    $(window).click(function(event) {
        if (event.target.id === 'authorModal') {
            $('#authorModal').fadeOut();
        }
    });
});
$('.photo-gallery img').click(function() {
    const src = $(this).attr('src');
    $('#modalImg').attr('src', src);
    $('#imgModal').addClass('active'); // Змінити на addClass
});

$('#imgModal').click(function(e) {
    if (e.target.id === 'imgModal') {
        $(this).removeClass('active'); // Змінити на removeClass
    }
});
function initMap() {
    const kyiv = { lat: 50.4501, lng: 30.5234 };

    const map = new google.maps.Map(document.getElementById("map"), {
        center: kyiv,
        zoom: 12,
    });

    const marker = new google.maps.Marker({
        position: kyiv,
        map: map,
        title: "Go Travels - Київ",
    });
}
$(document).ready(function() {
    $(window).scroll(function() {
        $('.country-card').each(function() {
            const cardTop = $(this).offset().top;
            const scrollPos = $(window).scrollTop() + $(window).height();
            
            if (scrollPos > cardTop + 100) {
                $(this).css({
                    'opacity': '1',
                    'transform': 'translateY(0)'
                });
            }
        });
    });
    
    // Ініціалізація - ховаємо картки на початку
    $('.country-card').css({
        'opacity': '0',
        'transform': 'translateY(50px)',
        'transition': 'all 0.5s ease'
    });
});
const API_KEY = '5ea7ed48a34f7a84a42e140f9a3379cb';
        
        // Функція для отримання погоди з API
        function getWeatherForCity(city, callback) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=ua`;
            
            $.ajax({
                url: url,
                method: 'GET',
                success: function(data) {
                    const weather = {
                        temp: Math.round(data.main.temp),
                        icon: getWeatherIcon(data.weather[0].id),
                        desc: data.weather[0].description
                    };
                    callback(weather);
                },
                error: function() {
                    // У випадку помилки показуємо дефолтні значення
                    callback({ 
                        temp: '--', 
                        icon: 'wi-cloud', 
                        desc: 'Дані недоступні' 
                    });
                }
            });
        }
        
        // Функція для вибору відповідної іконки
        function getWeatherIcon(weatherId) {
            if (weatherId >= 200 && weatherId < 300) {
                return 'wi-thunderstorm'; // Гроза
            } else if (weatherId >= 300 && weatherId < 400) {
                return 'wi-sprinkle'; // Мряка
            } else if (weatherId >= 500 && weatherId < 600) {
                return 'wi-rain'; // Дощ
            } else if (weatherId >= 600 && weatherId < 700) {
                return 'wi-snow'; // Сніг
            } else if (weatherId >= 700 && weatherId < 800) {
                return 'wi-fog'; // Туман
            } else if (weatherId === 800) {
                return 'wi-day-sunny'; // Ясно
            } else if (weatherId > 800) {
                return 'wi-cloudy'; // Хмарно
            } else {
                return 'wi-cloud'; // Запасний варіант
            }
        }
        
        // Додаємо віджети погоди до кожної картки країни
        $('.country-card').each(function() {
            const city = $(this).data('city');
            const countryCard = $(this);
            
            getWeatherForCity(city, function(weather) {
                const weatherWidget = $(`
                    <div class="weather-widget" title="${weather.desc}">
                        <i class="wi ${weather.icon}"></i>
                        <span class="weather-temp">${weather.temp}°C</span>
                    </div>
                `);
                
                countryCard.find('.country-image').append(weatherWidget);
            });
        });
    
        $('#direction').change(function() {
            if ($(this).val()) {
                $('#date').prop('disabled', false);
            } else {
                $('#date').prop('disabled', true);
                $('#date').val('');
            }
        });
        
        // Пошук турів
        $('#search-button').click(function() {
            const direction = $('#direction').val();
            const date = $('#date').val();
            
            let hasResults = false;
            
            $('.tour-card').each(function() {
                const cardDirection = $(this).data('country');
                const cardDate = $(this).data('date');
                
                // Перевірка відповідності критеріям пошуку
                const directionMatch = !direction || cardDirection === direction;
                const dateMatch = !date || cardDate === date;
                
                if (directionMatch && dateMatch) {
                    $(this).show();
                    hasResults = true;
                } else {
                    $(this).hide();
                }
            });
            
            // Показати/сховати повідомлення про відсутність результатів
            if (hasResults) {
                $('#no-results').addClass('hidden');
            } else {
                $('#no-results').removeClass('hidden');
            }
        });
        const tours = [
            {
                id: 1,
                destination: "Єгипет",
                resort: "Шарм-ель-Шейх",
                dateFrom: "2025-06-01",
                dateTo: "2025-06-08",
                nights: 7,
                price: 30000,
                image: "https://www.momondo.ua/himg/79/a4/47/ice-133422-79897800_3XL-305251.jpg"
            },
            {
                id: 2,
                destination: "Туреччина",
                resort: "Анталія",
                dateFrom: "2025-06-05",
                dateTo: "2025-06-12",
                nights: 7,
                price: 25000,
                image: "https://img.poehalisnami.ua/static/hotels/turciya/antaliya/h116987/orig/booking116987_1116987_638693964410100862.jpg"
            },
            {
                id: 3,
                destination: "Греція",
                resort: "Крит",
                dateFrom: "2025-06-10",
                dateTo: "2025-06-17",
                nights: 7,
                price: 32000,
                image: "https://img.poehalisnami.ua/static/hotels/greciya/o-krit/h6121/orig/booking6121_16121_638778204021289703.jpg"
            },
            {
                id: 4,
                destination: "ОАЕ",
                resort: "Дубай",
                dateFrom: "2025-06-15",
                dateTo: "2025-06-22",
                nights: 7,
                price: 45000,
                image: "https://img.poehalisnami.ua/static/hotels/oae/dzhumejjra/h103709/orig/booking103709_1.jpg"
            },
            {
                id: 5,
                destination: "Домінікана",
                resort: "Пунта Кана",
                dateFrom: "2025-06-20",
                dateTo: "2025-06-27",
                nights: 7,
                price: 55000,
                image: "https://img.poehalisnami.ua/static/hotels/dominikana/punta-kana/h232483/orig/booking232483_1232483_637503963803254246.jpg"
            },
            {
                id: 6,
                destination: "Мальдіви",
                resort: "Мале",
                dateFrom: "2025-06-25",
                dateTo: "2025-07-02",
                nights: 7,
                price: 60000,
                image: "https://dip.org.ua/wp-content/uploads/2022/09/994.jpg"
            },
            {
                id: 7,
                destination: "Таїланд",
                resort: "Пхукет",
                dateFrom: "2025-07-01",
                dateTo: "2025-07-08",
                nights: 7,
                price: 40000,
                image: "https://travel-tours.com.ua/wp-content/uploads/2017/07/2753_15.jpg"
            },
            {
                id: 8,
                destination: "Іспанія",
                resort: "Барселона",
                dateFrom: "2025-07-05",
                dateTo: "2025-07-12",
                nights: 7,
                price: 35000,
                image: "https://www.momondo.ua/himg/e0/f8/1a/leonardo-13892-159981887-841730.jpg"
            },
            {
                id: 9,
                destination: "Італія",
                resort: "Рим",
                dateFrom: "2025-07-10",
                dateTo: "2025-07-17",
                nights: 7,
                price: 38000,
                image: "https://cf.bstatic.com/static/img/theme-index/bg_resorts_new/6e8294d75f648eab2cd2818f0a40854367e584a5.jpg"
            },
            {
                id: 10,
                destination: "Єгипет",
                resort: "Хургада",
                dateFrom: "2025-07-15",
                dateTo: "2025-07-22",
                nights: 7,
                price: 28000,
                image: "https://img.poehalisnami.ua/static/hotels/egipet/khurgada/h114215/orig/booking114215_1114215_638693952023349436.jpg"
            },
            {
                id: 11,
                destination: "Туреччина",
                resort: "Бодрум",
                dateFrom: "2025-07-20",
                dateTo: "2025-07-27",
                nights: 7,
                price: 27000,
                image: "https://turkey.avantage-travel.com.ua/wp-content/uploads/2021/03/Bodrum.jpg"
            },
            {
                id: 12,
                destination: "Греція",
                resort: "Родос",
                dateFrom: "2025-08-01",
                dateTo: "2025-08-08",
                nights: 7,
                price: 31000,
                image: "https://kompastour.com/useruploads/regions/region_137feb2b3e.jpg"
            },
            {
                id: 13,
                destination: "ОАЕ",
                resort: "Абу-Дабі",
                dateFrom: "2025-08-05",
                dateTo: "2025-08-12",
                nights: 7,
                price: 42000,
                image: "https://content.r9cdn.net/rimg/dimg/a8/85/bbf8aa0b-city-9457-164d6a9147e.jpg?width=1200&height=630&crop=true"
            },
            {
                id: 14,
                destination: "Домінікана",
                resort: "Ла Романа",
                dateFrom: "2025-08-10",
                dateTo: "2025-08-17",
                nights: 7,
                price: 52000,
                image: "https://www.poihaluznamu.com/poyihaly_z_namy/images/articles/goteli-v-dominikani.jpg"
            },
            {
                id: 15,
                destination: "Мальдіви",
                resort: "Аліфу-Аліф",
                dateFrom: "2025-08-15",
                dateTo: "2025-08-22",
                nights: 7,
                price: 58000,
                image: "https://www.momondo.ua/himg/e7/62/6a/expedia_group-2783954-136859298-977172.jpg"
            }
        ];

       
        displayTours(tours);

      
        $('#destination').change(function() {
            if ($(this).val()) {
                $('#date').prop('disabled', false);
            } else {
                $('#date').prop('disabled', true);
                $('#date').val('');
            }
        });

       
        $('#tourFilter').submit(function(e) {
            e.preventDefault();
            
            const destination = $('#destination').val();
            const date = $('#date').val();
            
            let filteredTours = tours;
            
            if (destination) {
                filteredTours = filteredTours.filter(tour => tour.destination === destination);
            }
            
            if (date) {
                filteredTours = filteredTours.filter(tour => tour.dateFrom === date);
            }
            
            displayTours(filteredTours);
        });

    
        function displayTours(toursToDisplay) {
            const $container = $('#toursContainer');
            const $noResults = $('#noResults');
            
            $container.empty();
            
            if (toursToDisplay.length === 0) {
                $noResults.show();
            } else {
                $noResults.hide();
                
                toursToDisplay.forEach(tour => {
                    const tourCard = `
                        <div class="tour-card">
                            <div class="tour-image">
                                <img src="${tour.image}" alt="${tour.destination} - ${tour.resort}">
                            </div>
                            <div class="tour-info">
                                <h3 class="tour-destination">${tour.destination}</h3>
                                <p class="tour-resort">${tour.resort}</p>
                                <p class="tour-dates">${formatDate(tour.dateFrom)} - ${formatDate(tour.dateTo)} (${tour.nights} ночей)</p>
                                <div class="tour-price">
                                    <span class="price-amount">${tour.price.toLocaleString()} ₴</span>
                                    <button class="details-btn">Детальніше</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    $container.append(tourCard);
                });
            }
        }

      
        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            return `${day}.${month}`;
        }

       
        $('.author-link').click(function() {
            $('#authorModal').show();
        });

        $('.close').click(function() {
            $('#authorModal').hide();
        });
        $(window).scroll(function() {
            if ($(this).scrollTop() > 300) {
                $('#back-to-top').addClass('active');
            } else {
                $('#back-to-top').removeClass('active');
            }
        });
        
        $('#back-to-top').click(function() {
            $('html, body').animate({scrollTop: 0}, 300);
            return false;
        });
        
