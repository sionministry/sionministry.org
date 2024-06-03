const BASE_WP_API_URL = 'https://cms.sionministry.org/wp-json/wp/v2';

const parser = new DOMParser();

const loadPages = async function () {
    const overlay = document.querySelector('.overlay');
    const res = await fetch(BASE_WP_API_URL + '/pages');
    const pages = await res.json();
    overlay.style.display = 'none';
    for (const page of pages) {
        // parse content
        const content = parser.parseFromString(page.content.rendered, 'text/html');
            
        // visi & misi
        if (page.id == 11) {
            const visionElement = content.querySelectorAll('p')[1];
            document.querySelector('#hero-visi p').innerHTML = visionElement.innerHTML;
            document.querySelector('#footer p').innerText = visionElement.innerText;
            const missions = [];
            content.querySelectorAll('li').forEach(function (li) { this.push(li.innerHTML); }, missions);
            document.querySelector('#hero-misi p').innerHTML = missions.join(' ● ');
        } 
        
        // deskripsi pelayanan
        else if (page.id == 19) {
            const h3s = content.querySelectorAll('h3');
            const ps = content.querySelectorAll('p');
            const sectionDivs = document.querySelectorAll('#about .content div');
            // document.querySelector('#about .section-title p').innerHTML = h3s[0].innerHTML;
            sectionDivs[0].innerHTML =
                h3s[0].outerHTML + 
                ps[0].outerHTML + 
                h3s[1].outerHTML + 
                ps[1].outerHTML + 
                ps[2].outerHTML;
            sectionDivs[1].innerHTML = 
                ps[3].outerHTML + 
                ps[4].outerHTML;
        }

        // nilai-nilai
        else if (page.id == 13) {
            content.querySelectorAll('li').forEach(li => {
                let icon = '';
                const keyword = li.innerText.split('/')[0].trim().toLowerCase();
                switch (keyword) {
                    case 'love':
                        icon = 'bi-heart-fill';
                        color = '#ff689b';
                        break;
                    case 'integrity':
                        icon = 'bi-check-circle';
                        color = '#3430ba';
                        break;
                    case 'excellence':
                        icon = 'bi-trophy';
                        color = '#dfcb57';
                        break;
                    case 'biblical':
                        icon = 'bi-book-half';
                        color = '#6892ff';
                        break;
                    case 'committed':
                        icon = 'bi-fire';
                        color = '#e4193b';
                        break;
                    case 'compassion':
                        icon = 'bi-life-preserver';
                        color = '#ef0707db';
                        break;
                    case 'servanthood':
                        icon = 'bi-person-raised-hand';
                        color = '#7bb418db';
                        break;
                    default:
                        icon = 'bi-card-checklist';
                        color = '#1fc4aadb';
                }
                const div = parser.parseFromString(`
                <div class="col-lg-4 col-md-6 mb-3">
                    <div class="icon-box" data-aos="zoom-in-left">
                    <div class="icon"><i class="bi ${icon}" style="color:${color}"></i></div>
                    <h4 class="title">${li.innerText}</h4>
                    </div>
                </div>
                `, 'text/html')
                .querySelector('div');
                document.querySelector('#services .row').appendChild(div);
            });
        }

        // donasi
        else if (page.id == 21) {
            const p = content.querySelector('p');
            const data = p.innerHTML.split('<br>');
            const waNumber = (/\+(\d+)/g).exec(data[1])[1];
            const confirmationUrl = `https://wa.me/${waNumber}?text=Saya%20sudah%20transfer%20donasi%20untuk%20SION`;
            document.querySelector('#cta p').innerHTML = data[0];
            document.querySelector('#cta a.cta-btn').href = confirmationUrl;
        }

        // alamat & kontak
        else if (page.id == 17) {
            const p = content.querySelector('p');
            const data = p.innerHTML.split('<br>');
            console.log('alamat & kontak', data);
            document.querySelector('#contact .address p').innerHTML = 
                data[0] + '<br>' + data[1] + '<br>' + data[2];

            for (let i = 3; i < data.length; i++) {
                const p = document.createElement('p');
                p.innerHTML = data[i];
                document.querySelector('#contact .phone').appendChild(p);
            }
        }

        // pernyataan iman
        else if (page.id == 15) {
             // TODO
        }

        // media sosial
        else if (page.id == 23) {
            content.querySelectorAll('a').forEach(a => {
                let className;
                let icon;
                const keyword = a.href.toLowerCase();
                if (keyword.indexOf('instagram.com') >= 0) {
                    className = 'instagram';
                    icon = 'bxl-instagram';
                } else if (keyword.indexOf('twitter.com') >= 0 || keyword.indexOf('x.com') >= 0) {
                    className = 'twitter';
                    icon = 'bxl-twitter';
                } else if (keyword.indexOf('facebook.com') >= 0) {
                    className = 'facebook';
                    icon = 'bxl-facebook';
                } else if (keyword.indexOf('linkedin.com') >= 0) {
                    className = 'linkedin';
                    icon = 'bxl-linkedin';
                } else if (keyword.indexOf('google.com') >= 0) {
                    className = 'google-plus';
                    icon = 'bxl-google-plus';
                } else if (keyword.indexOf('skype.com') >= 0) {
                    className = 'skype';
                    icon = 'bxl-skype';
                } else if (keyword.indexOf('tiktok.com') >= 0) {
                    className = 'tiktok';
                    icon = 'bxl-tiktok';
                } else if (keyword.indexOf('youtube.com') >= 0) {
                    className = 'youtube';
                    icon = 'bxl-youtube';
                }
                if (className && icon) {
                    const link = parser.parseFromString(`
                    <a href="${a.href}" target="_blank" class="${className}"><i class="bx ${icon}"></i></a>
                    `, 'text/html')
                    .querySelector('a');
                    document.querySelector('#footer .social-links').appendChild(link);
                }
            });
        }
    }
}

/*============= READY =================*/

document.addEventListener("DOMContentLoaded", function() {
    loadPages();
});
