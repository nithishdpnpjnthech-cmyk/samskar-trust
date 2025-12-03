document.addEventListener('DOMContentLoaded', function() {
    
    // Optional: paste your Google Apps Script "web app" URL below to store submissions in Google Sheets
    // Leave blank to use local fallback storage (localStorage + CSV export)
    const SHEETS_WEB_APP_URL = ''; // e.g. 'https://script.google.com/macros/s/AKfycb.../exec'
    
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scroll-top');
    
    // Initialize translator and translate page on load
    if (window.translator) {
        window.translator.translatePage();
    }

    // Language switching functionality
    const languageBtn = document.getElementById('language-btn');
    const languageMenu = document.getElementById('language-menu');
    
    if (languageBtn) {
        languageBtn.addEventListener('click', () => {
            if (!languageMenu) return;
            languageMenu.classList.toggle('hidden');
            const exp = languageMenu.classList.contains('hidden') ? 'false' : 'true';
            languageBtn.setAttribute('aria-expanded', exp);
        });
    }
    
    if (languageMenu) {
        languageMenu.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-lang]');
            if (!btn) return;
            const lang = btn.getAttribute('data-lang');
            
            // Switch language using translator
            if (window.translator) {
                window.translator.switchLanguage(lang);
            }
            
            languageMenu.classList.add('hidden');
            if (languageBtn) languageBtn.setAttribute('aria-expanded','false');
        });
    }

    // Mobile language menu inside the mobile menu (close mobile menu after selecting)
    const mobileLanguageMenu = document.getElementById('language-menu-mobile');
    if (mobileLanguageMenu) {
        mobileLanguageMenu.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-lang]');
            if (!btn) return;
            const lang = btn.getAttribute('data-lang');
            if (window.translator) {
                window.translator.switchLanguage(lang);
            }

            // Close mobile menu and restore scrolling
            if (mobileMenu && mobileMenuBtn) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('no-scroll');
                mobileMenuBtn.setAttribute('aria-expanded','false');
            }
        });
    }
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        // Toggle Tailwind "hidden" so the menu actually appears/disappears
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        // update accessibility attribute
        const expanded = mobileMenu.classList.contains('active') ? 'true' : 'false';
        mobileMenuBtn.setAttribute('aria-expanded', expanded);
    });

    // Close mobile menu when clicking outside or on resize to desktop
    document.addEventListener('click', function(e) {
        if (!mobileMenu || !mobileMenuBtn) return;
        const isInside = mobileMenu.contains(e.target) || mobileMenuBtn.contains(e.target) || (languageMenu && languageMenu.contains(e.target));
        // if click outside and menu is visible -> close
        if (!isInside && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('no-scroll');
            mobileMenuBtn.setAttribute('aria-expanded','false');
        }
    });

    // Close mobile menu when any mobile link is clicked (safer fallback)
    mobileMenu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('no-scroll');
                mobileMenuBtn.setAttribute('aria-expanded','false');
            }
        });
    });

    // Ensure menu is closed if resizing to desktop width
    window.addEventListener('resize', function() {
        try {
            if (window.innerWidth >= 768) {
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    mobileMenuBtn.setAttribute('aria-expanded','false');
                }
            }
        } catch (err) { /* ignore */ }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (mobileMenu && mobileMenuBtn) {
                    mobileMenu.classList.remove('active');
                    mobileMenu.classList.add('hidden');
                    mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
                // Scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('shadow-xl');
            scrollTopBtn.classList.add('visible');
        } else {
            navbar.classList.remove('shadow-xl');
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in-section').forEach(element => {
        observer.observe(element);
    });

    // Restore original: only observe basic fade-in sections
    
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.counter-number').forEach(counter => {
        counterObserver.observe(counter);
    });
    
    const yearsCounter = document.getElementById('years-counter');
    if (yearsCounter) {
        const yearsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target, 5);
                }
            });
        }, { threshold: 0.5 });
        yearsObserver.observe(yearsCounter);
    }
    
    // Enhanced UPI Donation System (replaces old donation functionality)
    const UPI_ID = 'samsakartrust@paytm';
    const UPI_NAME = 'Samsakar Trust';
    let selectedDonationAmount = 0;

    // Update selected amount display and generate UPI link
    function updateDonationAmount(amount) {
        selectedDonationAmount = amount;
        const selectedAmountDisplay = document.getElementById('selected-amount');
        if (selectedAmountDisplay) {
            selectedAmountDisplay.textContent = `₹${amount.toLocaleString('en-IN')}`;
        }
        updateDonateButtonText();
    }

    // Update donate button text based on selected amount
    function updateDonateButtonText() {
        const donateBtnText = document.getElementById('donate-btn-text');
        if (donateBtnText) {
            if (selectedDonationAmount > 0) {
                donateBtnText.textContent = `Donate ₹${selectedDonationAmount.toLocaleString('en-IN')}`;
            } else {
                donateBtnText.textContent = 'Open Payment App';
            }
        }
    }

    // Generate UPI payment link with amount
    function generateUPILink(amount = 0) {
        const baseURL = 'upi://pay';
        const params = new URLSearchParams({
            pa: UPI_ID,  // Payee address (UPI ID)
            pn: UPI_NAME, // Payee name
            cu: 'INR'     // Currency
        });
        
        if (amount > 0) {
            params.append('am', amount.toString()); // Amount
            params.append('tn', `Donation to ${UPI_NAME} - Rs.${amount}`); // Transaction note
        } else {
            params.append('tn', `Donation to ${UPI_NAME}`); // Transaction note without amount
        }
        
        return `${baseURL}?${params.toString()}`;
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.donation-toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `donation-toast fixed top-20 right-4 z-50 px-6 py-3 rounded-xl text-white shadow-2xl transform transition-all duration-500 ease-out`;
        
        if (type === 'success') {
            toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else if (type === 'error') {
            toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else {
            toast.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }
        
        toast.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-semibold">${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0) scale(1)';
            toast.style.opacity = '1';
        }, 10);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%) scale(0.8)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Copy UPI ID to clipboard
    async function copyUPIID() {
        try {
            await navigator.clipboard.writeText(UPI_ID);
            showToast('UPI ID copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = UPI_ID;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showToast('UPI ID copied to clipboard!');
            } catch (e) {
                showToast('Copy failed. Please copy manually: ' + UPI_ID, 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    // Try to open UPI app
    function openUPIApp(app = 'generic') {
        const upiLink = generateUPILink(selectedDonationAmount);
        
        // Show loading state
        const donateBtnText = document.getElementById('donate-btn-text');
        const originalText = donateBtnText ? donateBtnText.textContent : '';
        if (donateBtnText) {
            donateBtnText.textContent = 'Opening app...';
        }
        
        // App-specific deep links
        const appLinks = {
            paytm: `paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR${selectedDonationAmount > 0 ? '&am=' + selectedDonationAmount : ''}`,
            googlepay: `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR${selectedDonationAmount > 0 ? '&am=' + selectedDonationAmount : ''}`,
            phonepe: `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR${selectedDonationAmount > 0 ? '&am=' + selectedDonationAmount : ''}`,
            generic: upiLink
        };
        
        const linkToOpen = appLinks[app] || appLinks.generic;
        
        // Try to open the app
        try {
            // Create a temporary link and click it
            const tempLink = document.createElement('a');
            tempLink.href = linkToOpen;
            tempLink.target = '_blank';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            
            showToast(`Opening ${app === 'generic' ? 'UPI app' : app}...`);
            
            // Fallback: if app doesn't open, copy UPI ID
            setTimeout(() => {
                copyUPIID();
                showToast('If app didn\'t open, UPI ID is copied to clipboard');
            }, 2000);
            
        } catch (error) {
            showToast('Unable to open app. UPI ID copied to clipboard!', 'error');
            copyUPIID();
        }
        
        // Restore button text
        setTimeout(() => {
            if (donateBtnText) {
                donateBtnText.textContent = originalText;
            }
        }, 2000);
    }

    // Event Listeners for donation functionality
    const donationBtns = document.querySelectorAll('.donation-amount-btn');
    const customAmountWrapper = document.getElementById('custom-amount-wrapper');
    const customAmountInput = document.getElementById('custom-amount');
    
    donationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            donationBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const amount = this.getAttribute('data-amount');
            
            if (amount === 'custom') {
                customAmountWrapper?.classList.remove('hidden');
                customAmountInput?.focus();
                updateDonationAmount(0); // Reset amount for custom input
            } else {
                customAmountWrapper?.classList.add('hidden');
                updateDonationAmount(parseInt(amount));
            }
        });
    });

    // Custom amount input
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            const amount = parseInt(this.value) || 0;
            updateDonationAmount(amount);
        });
    }

    // UPI ID click to copy
    const upiIdElement = document.getElementById('upi-id');
    if (upiIdElement) {
        upiIdElement.addEventListener('click', copyUPIID);
    }

    // QR code container click
    const qrCodeContainer = document.getElementById('qr-code-container');
    if (qrCodeContainer) {
        qrCodeContainer.addEventListener('click', () => openUPIApp());
    }

    // Payment app buttons
    const paymentAppBtns = document.querySelectorAll('.payment-app-btn');
    paymentAppBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const app = this.getAttribute('data-app');
            openUPIApp(app);
        });
    });

    // Main donate button
    const proceedDonateBtn = document.getElementById('proceed-donate-btn');
    if (proceedDonateBtn) {
        proceedDonateBtn.addEventListener('click', () => openUPIApp());
    }

    // Initialize
    updateDonateButtonText();
    
    // Volunteer form handler
    const volunteerForm = document.getElementById('volunteer-form');
    const volMsg = document.getElementById('vol-msg');
    
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('vol-name').value.trim();
            const phone = document.getElementById('vol-phone').value.trim();
            const description = document.getElementById('vol-desc').value.trim();
            
            if (!name || !phone) {
                volMsg.textContent = 'Please fill in name and phone number.';
                volMsg.className = 'text-sm text-center text-red-600';
                return;
            }
            
            // Show loading
            volMsg.textContent = 'Submitting...';
            volMsg.className = 'text-sm text-center text-blue-600';
            
            // Google Apps Script Web App URL
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz1jXV3RfYd24_Wyh8iL-oB1HZHPXJ7Maytp_U4UFBdX_EVOXZCuMVe5v1AbChBntxVpQ/exec';

            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('phone', phone);
                formData.append('description', description);
                formData.append('timestamp', new Date().toISOString());

                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                volMsg.textContent = 'Thank you for joining! We will contact you soon.';
                volMsg.className = 'text-sm text-center text-green-600';
                volunteerForm.reset();

            } catch (error) {
                volMsg.textContent = 'Sorry, there was an error. Please try again.';
                volMsg.className = 'text-sm text-center text-red-600';
                console.error('Error:', error);
            }
        });
    }
    
    // Quick Form Modal (Name + Phone only)
    const quickFormModal = document.getElementById('quick-form-modal');
    const quickFormBackdrop = document.getElementById('quick-form-backdrop');
    const quickFormClose = document.getElementById('quick-form-close');
    const quickForm = document.getElementById('quick-form');
    const qfName = document.getElementById('qf-name');
    const qfPhone = document.getElementById('qf-phone');
    const qfSource = document.getElementById('qf-source');
    
    function openQuickForm(source = 'general') {
        qfSource.value = source;
        quickFormModal.classList.remove('hidden');
        quickFormModal.classList.add('flex');
        document.body.classList.add('no-scroll');
        setTimeout(() => qfName.focus(), 50);
    }
    
    function closeQuickForm() {
        quickFormModal.classList.add('hidden');
        quickFormModal.classList.remove('flex');
        document.body.classList.remove('no-scroll');
        quickForm.reset();
    }
    
    document.querySelectorAll('.open-quick-form').forEach(btn => {
        btn.addEventListener('click', () => {
            const src = btn.getAttribute('data-source') || (btn.textContent.includes('Join Now') ? 'event' : 'general');
            openQuickForm(src);
        });
    });
    if (quickFormBackdrop) quickFormBackdrop.addEventListener('click', closeQuickForm);
    if (quickFormClose) quickFormClose.addEventListener('click', closeQuickForm);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quickFormModal && !quickFormModal.classList.contains('hidden')) {
            closeQuickForm();
        }
    });
    
    function toCSV(rows) {
        const header = ['Timestamp', 'Name', 'Phone', 'Source'];
        const data = rows.map(r => [r.timestamp, r.name, r.phone, r.source]);
        const all = [header, ...data].map(a => a.map(x => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
        return all;
    }
    
    async function submitToSheets(payload) {
        if (!SHEETS_WEB_APP_URL) return { ok: false, reason: 'no_url' };
        try {
            await fetch(SHEETS_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return { ok: true };
        } catch (e) {
            return { ok: false, reason: e?.message || 'network' };
        }
    }

    // CSV helper for volunteer rows
    function volunteersToCSV(rows) {
        const header = ['Timestamp', 'Name', 'Email', 'Phone', 'Message'];
        const data = rows.map(r => [r.timestamp, r.name, r.email, r.phone, r.message]);
        return [header, ...data].map(a => a.map(x => `"${String(x || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    }

    // Donate panel volunteer form handler (Join Now)
    const donateVolunteerForm = document.getElementById('donate-volunteer-form');
    const downloadVolunteersBtn = document.getElementById('download-volunteers-btn');
    if (donateVolunteerForm) {
        donateVolunteerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('dv-name').value.trim();
            const email = document.getElementById('dv-email').value.trim();
            const phone = document.getElementById('dv-phone').value.trim();
            const message = document.getElementById('dv-message').value.trim();
            if (!name || !email || !phone) {
                alert('Please fill name, email and phone.');
                return;
            }

            const row = {
                timestamp: new Date().toISOString(),
                name,
                email,
                phone,
                message
            };

            // try to submit to Google Sheets (if configured)
            let savedRemotely = false;
            try {
                const res = await submitToSheets({ type: 'volunteer', payload: row });
                if (res.ok) savedRemotely = true;
            } catch (err) {
                // ignore - fallback to localStorage
            }

            // save to localStorage
            const store = JSON.parse(localStorage.getItem('samsakar_volunteers') || '[]');
            store.push(row);
            localStorage.setItem('samsakar_volunteers', JSON.stringify(store));

            // If no remote sheet configured, auto-download CSV for admin convenience
            if (!savedRemotely && !SHEETS_WEB_APP_URL) {
                const csv = volunteersToCSV(store);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'samsakar-volunteers.csv';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            }

            // Toast confirmation
            const toast = document.createElement('div');
            toast.className = 'fixed top-24 right-4 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 animate-fade-in-up';
            toast.textContent = 'Thanks! Your volunteer request was submitted.';
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);

            donateVolunteerForm.reset();
        });
    }

    // Download volunteers CSV (admin)
    if (downloadVolunteersBtn) {
        downloadVolunteersBtn.addEventListener('click', function() {
            const store = JSON.parse(localStorage.getItem('samsakar_volunteers') || '[]');
            if (!store.length) {
                alert('No volunteer submissions found in local storage.');
                return;
            }
            const csv = volunteersToCSV(store);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'samsakar-volunteers.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });
    }

    /* Payment buttons behavior: attempt to open UPI intent and copy UPI ID to clipboard */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'fixed top-20 right-4 z-50 px-4 py-2 rounded-xl text-white shadow-lg animate-fade-in-up';
        toast.style.background = type === 'error' ? '#dc2626' : '#16a34a';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    }

    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const upi = btn.getAttribute('data-upi');
            const upiLink = btn.getAttribute('data-upi-link');

            // Try copy to clipboard first
            try {
                await navigator.clipboard.writeText(upi);
                showToast('UPI ID copied to clipboard');
            } catch (err) {
                // fallback - create temporary input
                const tmp = document.createElement('input');
                tmp.value = upi;
                document.body.appendChild(tmp);
                tmp.select();
                try { document.execCommand('copy'); showToast('UPI ID copied to clipboard'); } catch(e) { showToast('Copy failed - please copy manually', 'error'); }
                tmp.remove();
            }

            // Do NOT redirect or try to open apps on this static site.
            // We only copy the UPI ID to the clipboard and inform the user.
        });
    });


    // Success confirmation modal function
    function showSuccessModal(userName, source) {
        // Create success modal using translations
        const lang = getStoredLang();
        const t = (TRANSLATIONS[lang] || TRANSLATIONS['en'] || {});
        const successModal = document.createElement('div');
        successModal.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
        const eventType = source === 'event' ? (t.event_registration || 'Event Registration') : (t.volunteer_registration || 'Volunteer Registration');
        const title = t.success_title || 'Information Successfully Submitted!';
        const thanks = t.success_thanks || 'Thank you';
        const nextstep = t.success_nextstep || 'Our team will contact you within 24-48 hours';
        const needAssist = t.need_assist || 'Need immediate assistance?';
        const contactPhone = t.contact_phone || 'Call us at +91-XXXX-XXXX';
        const contactEmail = t.contact_email || 'Email: info@samsakartrust.org';

        successModal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-bounce-in">
                <div class="text-center">
                    <div class="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-poppins font-bold text-gray-900 mb-2">${title}</h3>
                    <p class="text-gray-600 mb-4">${thanks} <strong class="text-emerald-600">${userName}</strong> ${t.success_message_suffix || 'for your interest in joining us.'}</p>

                    <div class="bg-emerald-50 rounded-xl p-4 mb-4 text-left">
                        <h4 class="font-bold text-emerald-800 mb-2">📝 ${t.submission_details_label || 'Your submission details:'}</h4>
                        <ul class="text-sm text-emerald-700 space-y-1">
                            <li>• <strong>${t.label_type || 'Type:'}</strong> ${eventType}</li>
                            <li>• <strong>${t.label_status || 'Status:'}</strong> ${t.status_received || 'Successfully received'}</li>
                            <li>• <strong>${t.label_next || 'Next Step:'}</strong> ${nextstep}</li>
                            <li>• <strong>${t.label_ref || 'Reference:'}</strong> ${Date.now().toString().slice(-6)}</li>
                        </ul>
                    </div>

                    <div class="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                        <h4 class="font-bold text-blue-800 mb-2">📞 ${needAssist}</h4>
                        <p class="text-sm text-blue-700">${contactPhone}<br>${contactEmail}</p>
                    </div>

                    <button onclick="this.closest('.fixed').remove()" class="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg">${t.success_cta || 'Got it! Thanks ✨'}</button>
                </div>
            </div>
        `;

        document.body.appendChild(successModal);

        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(successModal)) {
                successModal.style.opacity = '0';
                setTimeout(() => successModal.remove(), 300);
            }
        }, 10000);
    }

    
    quickForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = qfName.value.trim();
        const phone = qfPhone.value.trim();
        const source = qfSource.value || 'general';
        if (!name || !phone) return;
        
        // Show loading
        const submitBtn = document.getElementById('qf-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        try {
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz1jXV3RfYd24_Wyh8iL-oB1HZHPXJ7Maytp_U4UFBdX_EVOXZCuMVe5v1AbChBntxVpQ/exec';
            
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('description', source === 'event' ? 'Event Registration' : 'General Inquiry');
            formData.append('timestamp', new Date().toISOString());

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            // Show enhanced success message modal instead of simple toast
            showSuccessModal(name, source);
            
            // Also show a simple toast for immediate feedback
            const toast = document.createElement('div');
            toast.className = 'fixed top-24 right-4 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 animate-fade-in-up';
            toast.innerHTML = `
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span>Information submitted successfully!</span>
                </div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2000);
            
            closeQuickForm();
            
        } catch (error) {
            const toast = document.createElement('div');
            toast.className = 'fixed top-24 right-4 bg-red-600 text-white px-5 py-3 rounded-xl shadow-2xl z-50 animate-fade-in-up';
            toast.textContent = 'Sorry, there was an error. Please try again.';
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Cause Learn More Modal with Detailed Content
    const causeModal = document.getElementById('cause-modal');
    const causeModalContent = document.getElementById('cause-modal-content');
    const causeModalClose = document.getElementById('cause-modal-close');
    const causeModalBackdrop = document.getElementById('cause-modal-backdrop');
    
    const causeDetails = {
        medical: {
            title: 'Medical Aid Program',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
            content: `
                <div class="space-y-6">
                    <div class="relative mb-8">
                        <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" alt="Medical Aid Program" class="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl"></div>
                        <div class="absolute bottom-6 left-6 right-6">
                            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-poppins font-black text-white mb-2 drop-shadow-lg">Medical Aid Program</h2>
                            <p class="text-lg sm:text-xl text-white/90 font-bold drop-shadow-md">Comprehensive Healthcare Services for Underserved Communities</p>
                        </div>
                    </div>
                    
                    <div class="prose prose-lg max-w-none">
                        <h3 class="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-6 border-l-4 border-red-500 pl-4">🏥 Overview</h3>
                        <p class="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                            Samsakar Trust's Medical Aid Program stands as a beacon of hope for thousands of families across India who struggle to access basic healthcare services. In a country where millions lack adequate medical facilities, our program bridges the critical gap between need and care, ensuring that no one is left behind due to financial constraints or geographical barriers.
                        </p>
                        
                        <h3 class="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-6 mt-10 border-l-4 border-red-500 pl-4">🩺 Our Comprehensive Healthcare Services</h3>
                        <p class="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                            Our medical aid initiative encompasses a wide spectrum of healthcare services designed to address both immediate medical needs and long-term health outcomes. We operate through multiple channels including mobile health camps, permanent clinic facilities, and partnerships with established hospitals and medical professionals.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Free Health Camps</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We organize regular health camps in rural and urban slum areas, bringing medical services directly to communities that need them most. These camps provide free consultations, basic diagnostic tests, vaccinations, and health screenings. Our team of qualified doctors, nurses, and medical volunteers work tirelessly to ensure that every individual receives proper attention and care. In the past year alone, we have conducted over 150 health camps, serving more than 25,000 patients across Karnataka, Maharashtra, and Tamil Nadu.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Emergency Medical Assistance</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Medical emergencies can devastate families financially. Our emergency medical assistance fund provides immediate financial support for critical surgeries, treatments, and hospitalizations. We have helped over 500 families in the last two years, covering expenses for life-saving procedures including cardiac surgeries, cancer treatments, organ transplants, and emergency trauma care. Our streamlined application process ensures that help reaches those in need within 24-48 hours of application approval.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Chronic Disease Management</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We provide ongoing support for individuals suffering from chronic conditions such as diabetes, hypertension, heart disease, and respiratory illnesses. Our program includes regular health check-ups, medication assistance, dietary counseling, and lifestyle modification guidance. We maintain detailed health records for each patient, ensuring continuity of care and early detection of complications.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Maternal and Child Health</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            The health of mothers and children is fundamental to community well-being. Our maternal health program provides prenatal care, safe delivery support, postnatal care, and infant health services. We conduct regular workshops on nutrition, breastfeeding, immunization, and child development. Our child health initiatives include growth monitoring, vaccination drives, and treatment for common childhood illnesses. Over 3,000 mothers and children have benefited from these services in the past year.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Mental Health Support</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Recognizing the critical importance of mental health, we have integrated psychological counseling and support services into our medical aid program. Our team of trained counselors provides individual and group therapy sessions, addressing issues such as depression, anxiety, trauma, and stress management. We also conduct awareness programs to reduce stigma around mental health issues in communities.
                        </p>
                        
                        <div class="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl mt-10 mb-8 border border-red-200">
                            <h3 class="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-6 border-l-4 border-red-500 pl-4">📊 Impact and Achievements</h3>
                            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div class="bg-white p-4 rounded-xl text-center shadow-lg">
                                    <div class="text-2xl font-black text-red-500">₹2.5Cr+</div>
                                    <div class="text-sm font-bold text-gray-700">Medical Aid Provided</div>
                                </div>
                                <div class="bg-white p-4 rounded-xl text-center shadow-lg">
                                    <div class="text-2xl font-black text-red-500">500+</div>
                                    <div class="text-sm font-bold text-gray-700">Health Camps</div>
                                </div>
                                <div class="bg-white p-4 rounded-xl text-center shadow-lg">
                                    <div class="text-2xl font-black text-red-500">8,000+</div>
                                    <div class="text-sm font-bold text-gray-700">Lives Touched</div>
                                </div>
                                <div class="bg-white p-4 rounded-xl text-center shadow-lg">
                                    <div class="text-2xl font-black text-red-500">25,000+</div>
                                    <div class="text-sm font-bold text-gray-700">Patients Served</div>
                                </div>
                            </div>
                            <p class="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                                Since its inception, our Medical Aid Program has made a profound impact on the lives of thousands. We have provided medical assistance worth over ₹2.5 crores, conducted more than 500 health camps, and supported over 8,000 individuals with various medical needs. Our success stories include complete recovery from life-threatening conditions, successful management of chronic diseases, and improved quality of life for countless families.
                            </p>
                        </div>
                        
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                            <h3 class="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-6 border-l-4 border-green-500 pl-4">🤝 How You Can Help</h3>
                            <p class="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                                Your support can help us expand our reach and save more lives. Every contribution, whether monetary or through volunteering, makes a tangible difference. Medical professionals can volunteer their time and expertise, while financial contributions help us purchase medicines, medical equipment, and fund critical treatments. Together, we can ensure that quality healthcare is accessible to all, regardless of their economic circumstances.
                            </p>
                            <div class="mt-6">
                                <button onclick="scrollToDonate()" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-black text-lg rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg border-2 border-red-700">
                                    💝 Donate for Medical Aid
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        food: {
            title: 'Food Support Program',
            image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
            content: `
                <div class="space-y-6">
                    <div class="relative mb-8">
                        <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80" alt="Food Support Program" class="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl"></div>
                        <div class="absolute bottom-6 left-6 right-6">
                            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-poppins font-black text-white mb-2 drop-shadow-lg">Food Support Program</h2>
                            <p class="text-lg sm:text-xl text-white/90 font-bold drop-shadow-md">Fighting Hunger, Nourishing Communities</p>
                        </div>
                    </div>
                    
                    <div class="prose prose-lg max-w-none">
                        <h3 class="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-6 border-l-4 border-emerald-500 pl-4">🍽️ Overview</h3>
                        <p class="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                            Hunger remains one of the most pressing challenges facing India today. Despite significant economic growth, millions of families struggle to put nutritious food on their tables. Samsakar Trust's Food Support Program addresses this critical need through a comprehensive approach that includes daily meal distribution, emergency food assistance, nutrition programs, and community kitchens.
                        </p>
                        
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4 mt-8">Our Multi-Faceted Approach</h3>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Daily Meal Distribution</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We operate community kitchens in several locations that prepare and distribute hot, nutritious meals daily to over 1,500 individuals. These meals are carefully planned by nutritionists to ensure they meet basic dietary requirements, including adequate proteins, carbohydrates, vitamins, and minerals. Our kitchens follow strict hygiene standards and use fresh, locally sourced ingredients whenever possible. The meals are distributed to the elderly, daily wage workers, homeless individuals, and families facing temporary financial difficulties.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Emergency Food Assistance</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Natural disasters, job losses, medical emergencies, and other crises can suddenly leave families without food. Our emergency food assistance program provides immediate relief through food kits containing essential items like rice, dal, cooking oil, spices, and basic vegetables. These kits are designed to sustain a family of four for approximately one week. In the past year, we have distributed over 5,000 emergency food kits to families in distress.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Nutrition Programs for Children</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Malnutrition among children is a serious concern that affects their physical and mental development. Our specialized nutrition program targets children under the age of 12, providing them with nutrient-rich meals, health supplements, and regular health check-ups. We work closely with schools and community centers to ensure that children receive proper nutrition during their critical growth years. Over 2,000 children are currently enrolled in this program, showing significant improvements in their health indicators.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Senior Citizen Meal Program</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Elderly individuals, especially those living alone or with limited family support, often struggle to prepare meals. Our senior citizen meal program delivers freshly prepared, easy-to-digest meals to over 300 elderly individuals daily. These meals are tailored to meet the specific dietary needs of older adults, including reduced salt and sugar content, and are delivered with care and respect by our dedicated volunteers.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Festival and Special Occasion Meals</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Festivals and special occasions should be times of joy and celebration for everyone. We organize special meal distributions during major festivals like Diwali, Eid, Christmas, and other cultural celebrations, ensuring that families can celebrate together with proper meals. These events also serve as opportunities to bring communities together and spread happiness.
                        </p>
                        
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4 mt-8">Sustainability and Community Involvement</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Our food support program is designed to be sustainable and community-driven. We partner with local farmers and suppliers to source ingredients, supporting the local economy. Community members are encouraged to volunteer in meal preparation and distribution, fostering a sense of ownership and solidarity. We also conduct workshops on nutrition, food preservation, and budget-friendly cooking to empower families to make better food choices.
                        </p>
                        
                        <div class="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl mt-10 mb-8 border border-emerald-200">
                            <h3 class="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-6 border-l-4 border-emerald-500 pl-4">📊 Impact Statistics</h3>
                            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div class="bg-white p-4 rounded-xl text-center shadow-lg">
                                    <div class="text-2xl font-black text-emerald-500">1.2M+</div>
                                    <div class="text-sm font-bold text-gray-700">Meals Served</div>
                                </div>
                                <div class="bg-white p-4 rounded-xl text-center shadow-lg">
                                    <div class="text-2xl font-black text-emerald-500">15,000+</div>
                                    <div class="text-sm font-bold text-gray-700">Food Kits Distributed</div>
                                </div>
                                <div class="bg-white p-4 rounded-xl text-center shadow-lg">
                                    <div class="text-2xl font-black text-emerald-500">1,500</div>
                                    <div class="text-sm font-bold text-gray-700">Daily Beneficiaries</div>
                                </div>
                                <div class="bg-white p-4 rounded-xl text-center shadow-lg">
                                    <div class="text-2xl font-black text-emerald-500">365</div>
                                    <div class="text-sm font-bold text-gray-700">Days Operation</div>
                                </div>
                            </div>
                            <p class="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                                Since the program's launch, we have served over 1.2 million meals, distributed more than 15,000 emergency food kits, and supported thousands of families during difficult times. Our community kitchens operate 365 days a year, ensuring that no one goes hungry. The program has not only addressed immediate hunger but has also contributed to improved health outcomes, better school attendance among children, and enhanced community cohesion.
                            </p>
                        </div>
                        
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4 mt-8">Partnerships and Support</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We collaborate with restaurants, hotels, catering services, and food manufacturers who contribute surplus food and ingredients. Corporate partnerships have enabled us to scale our operations and reach more communities. Individual donors and volunteers form the backbone of our program, contributing time, resources, and compassion that make our work possible.
                        </p>
                        
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                            <h3 class="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-6 border-l-4 border-green-500 pl-4">🤝 How You Can Contribute</h3>
                            <p class="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                                There are multiple ways to support our food support program. You can sponsor meals for a day, week, or month. Volunteers are always welcome to help with meal preparation, packaging, and distribution. Food donations in kind are also accepted. Financial contributions help us purchase ingredients, maintain kitchen facilities, and expand our reach to more communities. Every contribution, no matter how small, helps us feed another hungry person and bring hope to another family.
                            </p>
                            <div class="mt-6">
                                <button onclick="scrollToDonate()" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-700 to-emerald-800 text-white font-black text-lg rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-xl border-2 border-green-900 hover:from-green-800 hover:to-emerald-900">
                                    🍽️ Donate for Food Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        education: {
            title: 'Education Support Program',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
            content: `
                <div class="space-y-6">
                    <div class="relative mb-8">
                        <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80" alt="Education Support Program" class="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl"></div>
                        <div class="absolute bottom-6 left-6 right-6">
                            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-poppins font-black text-white mb-2 drop-shadow-lg">Education Support Program</h2>
                            <p class="text-lg sm:text-xl text-white/90 font-bold drop-shadow-md">Empowering Minds, Transforming Futures</p>
                        </div>
                    </div>
                    
                    <div class="prose prose-lg max-w-none">
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4">Overview</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Education is the most powerful tool for breaking the cycle of poverty and creating lasting change. Samsakar Trust's Education Support Program is dedicated to ensuring that every child, regardless of their economic background, has access to quality education. We believe that education is not a privilege but a fundamental right, and we work tirelessly to make this right accessible to all.
                        </p>
                        
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4 mt-8">Comprehensive Educational Initiatives</h3>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Scholarship Programs</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Our scholarship program provides financial assistance to meritorious students from economically disadvantaged backgrounds. We offer scholarships for school fees, college tuition, books, uniforms, and other educational expenses. The program covers students from primary school through postgraduate studies. Currently, we support over 500 students across various educational levels. Our selection process is transparent and merit-based, ensuring that deserving students receive the support they need to pursue their academic dreams.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">After-School Tutoring Centers</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Many children from underprivileged backgrounds struggle academically due to lack of proper guidance and resources at home. Our after-school tutoring centers provide free coaching in core subjects like Mathematics, Science, English, and Social Studies. These centers are equipped with learning materials, computers, and qualified teachers who provide personalized attention to each student. We currently operate 12 tutoring centers serving over 800 students, with many showing significant improvement in their academic performance.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Digital Literacy Programs</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            In today's digital age, computer literacy is essential for academic and professional success. Our digital literacy programs teach children and young adults basic computer skills, internet usage, and essential software applications. We have established computer labs in several locations, providing hands-on training to over 1,200 students annually. This program has opened up new opportunities for many students, enabling them to compete in the modern job market.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Educational Material Distribution</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We regularly distribute school supplies including notebooks, pens, pencils, textbooks, bags, and uniforms to students in need. These materials, though seemingly small, can be a significant financial burden for many families. By providing these essentials, we ensure that children can attend school with dignity and focus on their studies without worrying about basic supplies. We have distributed educational materials to over 3,000 students in the past year.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Career Counseling and Guidance</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Choosing the right career path is crucial for a student's future success. Our career counseling program provides guidance to high school and college students, helping them identify their strengths, interests, and suitable career options. We organize career fairs, invite professionals from various fields to share their experiences, and provide information about different career paths, higher education options, and scholarship opportunities.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Skill Development Workshops</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Beyond academic education, we conduct workshops on life skills, communication, leadership, and entrepreneurship. These workshops help students develop confidence, critical thinking abilities, and practical skills that are essential for success in life. We also organize science fairs, debate competitions, and cultural events that provide platforms for students to showcase their talents and build self-esteem.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Support for Special Needs Students</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We recognize that students with special needs require additional support and resources. Our program includes specialized assistance for children with learning disabilities, physical challenges, and other special needs. We work with special educators and therapists to provide appropriate support and ensure inclusive education opportunities.
                        </p>
                        
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4 mt-8">Success Stories and Impact</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Our Education Support Program has transformed the lives of countless students. Many of our scholarship recipients have gone on to pursue higher education at prestigious institutions, secure good jobs, and become role models in their communities. Over 200 students supported by our program have completed their graduation, and more than 50 have pursued postgraduate studies. Several have returned as volunteers and donors, creating a beautiful cycle of giving back.
                        </p>
                        
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4 mt-8">Community Engagement</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We actively engage parents and community members in our education initiatives. We conduct parent-teacher meetings, awareness sessions on the importance of education, and workshops on how parents can support their children's learning at home. This community involvement has resulted in increased enrollment rates, better attendance, and improved academic outcomes.
                        </p>
                        
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                            <h3 class="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-6 border-l-4 border-green-500 pl-4">🤝 How You Can Support</h3>
                            <p class="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                                Education is an investment in the future, and your support can help shape countless futures. You can sponsor a child's education, donate educational materials, volunteer as a tutor or mentor, or contribute to our scholarship fund. Teachers and educators can volunteer their expertise, while professionals can share their career experiences with students. Every contribution helps us build a more educated, empowered, and equitable society.
                            </p>
                            <div class="mt-6">
                                <button onclick="scrollToDonate()" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg border-2 border-blue-700">
                                    📚 Donate for Education
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        women: {
            title: 'Women Empowerment Program',
            image: 'attached_assets/WhatsApp Image 2025-11-04 at 10.18.12 AM_1762329925065.jpeg',
            content: `
                <div class="space-y-6">
                    <div class="relative mb-8">
                        <img src="attached_assets/WhatsApp Image 2025-11-04 at 10.18.12 AM_1762329925065.jpeg" alt="Women Empowerment Program" class="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-2xl">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl"></div>
                        <div class="absolute bottom-6 left-6 right-6">
                            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-poppins font-black text-white mb-2 drop-shadow-lg">Women Empowerment Program</h2>
                            <p class="text-lg sm:text-xl text-white/90 font-bold drop-shadow-md">Empowering Women to Empower the Nation</p>
                        </div>
                    </div>
                    
                    <div class="prose prose-lg max-w-none">
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4">Overview</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Women empowerment is at the heart of Samsakar Trust's mission. We firmly believe that when women are empowered, entire communities and nations prosper. Our comprehensive Women Empowerment Program addresses multiple dimensions of empowerment including economic independence, skill development, health awareness, legal rights, and leadership development. Through this program, we have transformed the lives of thousands of women across India.
                        </p>
                        
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4 mt-8">Comprehensive Empowerment Initiatives</h3>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Vocational Training and Skill Development</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Economic independence is fundamental to women's empowerment. Our vocational training programs equip women with marketable skills that enable them to earn a livelihood and support their families. We offer training in various fields including tailoring and garment making, beauty and wellness services, food processing and preservation, handicrafts, computer skills, and small business management. Our training centers are equipped with modern equipment and tools, and our instructors are experienced professionals who provide hands-on training. Over 2,500 women have completed our vocational training programs, with more than 70% successfully establishing their own businesses or finding employment.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Entrepreneurship Development</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We go beyond skill training to support women in starting and running their own businesses. Our entrepreneurship development program includes business planning workshops, financial literacy training, access to microfinance and loans, marketing support, and mentorship. We help women identify viable business opportunities, develop business plans, and navigate the challenges of entrepreneurship. Many of our program graduates have successfully established businesses in sectors like food catering, garment manufacturing, beauty salons, and handicraft production, creating employment opportunities for others in their communities.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Self-Help Groups and Collective Action</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We facilitate the formation of self-help groups (SHGs) where women come together to save money, access credit, and support each other's economic activities. These groups provide a platform for collective decision-making, mutual support, and community organizing. We have helped establish over 100 SHGs with more than 1,500 active members. These groups have collectively saved over ₹50 lakhs and accessed loans worth more than ₹2 crores for various income-generating activities.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Health and Wellness Programs</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Women's health is crucial for their empowerment. We conduct regular health camps focusing on women's health issues including reproductive health, maternal care, nutrition, and prevention of common diseases. We provide health education, screenings, and referrals for specialized care. Our wellness programs include yoga classes, fitness sessions, and stress management workshops. We also address mental health issues and provide counseling services for women facing domestic violence, depression, or other challenges.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Legal Awareness and Rights Education</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Knowledge of legal rights is essential for women's empowerment. We conduct legal awareness workshops covering topics such as property rights, inheritance laws, domestic violence laws, workplace rights, and legal procedures for seeking justice. We partner with legal aid organizations to provide free legal counseling and support for women facing legal issues. Our legal awareness programs have empowered thousands of women to assert their rights and seek justice when needed.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Leadership Development</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            We believe in developing women leaders who can drive change in their communities. Our leadership development program includes training in public speaking, community organizing, conflict resolution, and decision-making. We encourage and support women to take up leadership roles in their communities, SHGs, and local governance bodies. Many of our program participants have become community leaders, SHG coordinators, and active participants in local governance.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Digital Literacy for Women</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            In the digital age, computer and internet literacy are essential skills. Our digital literacy program specifically targets women, teaching them basic computer skills, internet usage, online banking, digital marketing, and e-commerce. This knowledge has enabled many women to expand their businesses online, access government services digitally, and connect with wider markets and opportunities.
                        </p>
                        
                        <h4 class="text-xl font-poppins font-bold text-deep-green mb-3 mt-6">Financial Literacy and Banking</h4>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            Financial independence requires financial literacy. We conduct workshops on budgeting, saving, banking, insurance, and investment basics. We help women open bank accounts, understand banking services, and manage their finances effectively. This knowledge empowers women to make informed financial decisions and secure their economic future.
                        </p>
                        
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4 mt-8">Impact and Transformation</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            The impact of our Women Empowerment Program extends far beyond individual women. Empowered women invest in their children's education, improve family nutrition, make better healthcare decisions, and contribute to community development. Studies show that when women earn income, they reinvest 90% of it in their families, compared to 30-40% for men. Our program has created a ripple effect, transforming not just individual lives but entire families and communities.
                        </p>
                        
                        <h3 class="text-2xl font-poppins font-bold text-deep-green mb-4 mt-8">Success Stories</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            The success stories from our program are inspiring. Women who once struggled to make ends meet are now successful entrepreneurs employing others. Women who were confined to their homes are now community leaders. Women who lacked confidence are now training others and sharing their knowledge. These transformations demonstrate the power of empowerment and the potential that exists in every woman when given the right opportunities and support.
                        </p>
                        
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                            <h3 class="text-2xl sm:text-3xl font-poppins font-black text-gray-900 mb-6 border-l-4 border-green-500 pl-4">🤝 How You Can Support</h3>
                            <p class="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                                Supporting women empowerment is an investment in a better future for all. You can contribute by sponsoring a woman's training, donating to our microfinance fund, volunteering your skills to train women, or providing mentorship. Corporate partnerships can help us scale our programs and reach more women. Every contribution, whether financial or through volunteering, helps us empower more women and create a more equitable society where women can realize their full potential and contribute meaningfully to nation-building.
                            </p>
                            <div class="mt-6">
                                <button onclick="scrollToDonate()" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg border-2 border-purple-700">
                                    👩‍💼 Donate for Women Empowerment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    };
    
    document.querySelectorAll('.cause-learn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const cause = this.getAttribute('data-cause');
            const details = causeDetails[cause];
            
            if (details) {
                causeModalContent.innerHTML = details.content;
                causeModal.classList.remove('hidden');
                causeModal.classList.add('flex');
                document.body.style.overflow = 'hidden';
                // translator removed: no dynamic translation applied
            }
        });
    });
    
    function closeCauseModal() {
        causeModal.classList.add('hidden');
        causeModal.classList.remove('flex');
        causeModalContent.innerHTML = '';
        document.body.style.overflow = '';
    }
    
    if (causeModalClose) {
        causeModalClose.addEventListener('click', closeCauseModal);
    }
    
    if (causeModalBackdrop) {
        causeModalBackdrop.addEventListener('click', closeCauseModal);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out;
        }
        
        /* Upload zone styles */
        #drop-zone.dragover {
            border-color: #10b981;
            background-color: #ecfdf5;
        }
        
        /* Gallery item animation */
        .gallery-item {
            opacity: 1;
            transform: scale(1);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        /* Upload button hover effect */
        #upload-btn:hover {
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }
        

    `;
    document.head.appendChild(style);

    // Gallery Filter Functionality
    const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            galleryFilterBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('bg-gradient-to-r', 'from-warm-orange', 'to-coral', 'text-white');
                b.classList.add('bg-white', 'text-deep-green', 'border-2', 'border-deep-green');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.classList.remove('bg-white', 'text-deep-green', 'border-2', 'border-deep-green');
            this.classList.add('bg-gradient-to-r', 'from-warm-orange', 'to-coral', 'text-white');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Video Modal Functionality for Testimonials
    const videoModal = document.getElementById('video-modal');
    const videoModalIframe = document.getElementById('video-modal-iframe');
    const videoModalClose = document.getElementById('video-modal-close');
    const videoModalBackdrop = document.getElementById('video-modal-backdrop');
    
    document.querySelectorAll('.testimonial-video').forEach(item => {
        item.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video-url');
            if (videoUrl) {
                videoModalIframe.src = videoUrl + '?autoplay=1';
                videoModal.classList.remove('hidden');
                videoModal.classList.add('flex');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    function closeVideoModal() {
        videoModal.classList.add('hidden');
        videoModal.classList.remove('flex');
        videoModalIframe.src = '';
        document.body.style.overflow = '';
    }
    
    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeVideoModal);
    }
    
    if (videoModalBackdrop) {
        videoModalBackdrop.addEventListener('click', closeVideoModal);
    }
    
    // Gallery Lightbox Functionality
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const galleryLightboxContent = document.getElementById('gallery-lightbox-content');
    const galleryLightboxClose = document.getElementById('gallery-lightbox-close');
    const galleryLightboxBackdrop = document.getElementById('gallery-lightbox-backdrop');
    
        document.querySelectorAll('.gallery-image-item, .gallery-video-item').forEach(item => {
            item.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const src = this.getAttribute('data-src');
                const videoUrl = this.getAttribute('data-video-url');
                const videoType = this.getAttribute('data-video-type') || 'youtube'; // 'youtube' or 'uploaded'
                
                if (type === 'video' && videoUrl) {
                    if (videoType === 'youtube' || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                        // YouTube video
                        const embedUrl = videoUrl.includes('embed') ? videoUrl : videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');
                        galleryLightboxContent.innerHTML = `
                            <iframe src="${embedUrl}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full"></iframe>
                        `;
                    } else {
                        // Uploaded video (MP4, WebM, etc.)
                        galleryLightboxContent.innerHTML = `
                            <video controls autoplay class="w-full h-full" style="object-fit: contain;">
                                <source src="${videoUrl}" type="video/mp4">
                                <source src="${videoUrl}" type="video/webm">
                                Your browser does not support the video tag.
                            </video>
                        `;
                    }
                } else if (type === 'image' && src) {
                    galleryLightboxContent.innerHTML = `
                        <img src="${src}" alt="Gallery Image" class="w-full h-full object-contain">
                    `;
                }
                
                galleryLightbox.classList.remove('hidden');
                galleryLightbox.classList.add('flex');
                document.body.style.overflow = 'hidden';
            });
        });
    
    function closeGalleryLightbox() {
        galleryLightbox.classList.add('hidden');
        galleryLightbox.classList.remove('flex');
        galleryLightboxContent.innerHTML = '';
        document.body.style.overflow = '';
    }
    
    if (galleryLightboxClose) {
        galleryLightboxClose.addEventListener('click', closeGalleryLightbox);
    }
    
    if (galleryLightboxBackdrop) {
        galleryLightboxBackdrop.addEventListener('click', closeGalleryLightbox);
    }
    
    // Image Upload Functionality
    const uploadModal = document.getElementById('upload-modal');
    const uploadBtn = document.getElementById('upload-btn');
    const uploadClose = document.getElementById('upload-close');
    const uploadBackdrop = document.getElementById('upload-backdrop');
    const uploadForm = document.getElementById('upload-form');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreviews = document.getElementById('image-previews');
    const galleryGrid = document.getElementById('gallery-grid');
    
    let selectedFiles = [];
    
    // Open upload modal
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            uploadModal.classList.remove('hidden');
            uploadModal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close upload modal
    function closeUploadModal() {
        uploadModal.classList.add('hidden');
        uploadModal.classList.remove('flex');
        document.body.style.overflow = '';
        selectedFiles = [];
        imagePreviews.innerHTML = '';
        previewContainer.classList.add('hidden');
        uploadForm.reset();
    }
    
    if (uploadClose) uploadClose.addEventListener('click', closeUploadModal);
    if (uploadBackdrop) uploadBackdrop.addEventListener('click', closeUploadModal);
    
    // Drag and drop functionality
    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('border-emerald-500', 'bg-emerald-50');
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('border-emerald-500', 'bg-emerald-50');
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('border-emerald-500', 'bg-emerald-50');
            const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
            handleFiles(files);
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            handleFiles(files);
        });
    }
    
    // Handle selected files
    function handleFiles(files) {
        selectedFiles = files.filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                showToast(`File ${file.name} is too large. Max size is 10MB.`, 'error');
                return false;
            }
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                showToast(`File ${file.name} is not supported. Use images or videos only.`, 'error');
                return false;
            }
            return true;
        });
        
        if (selectedFiles.length > 0) {
            displayPreviews();
        }
    }
    
    // Display file previews
    function displayPreviews() {
        imagePreviews.innerHTML = '';
        previewContainer.classList.remove('hidden');
        
        selectedFiles.forEach((file, index) => {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'relative group';
            
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewDiv.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" class="w-full h-24 object-cover rounded-lg">
                        <button type="button" class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors" onclick="removeFile(${index})">
                            ×
                        </button>
                        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                            ${file.name}
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith('video/')) {
                previewDiv.innerHTML = `
                    <div class="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    <button type="button" class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors" onclick="removeFile(${index})">
                        ×
                    </button>
                    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                        ${file.name}
                    </div>
                `;
            }
            
            imagePreviews.appendChild(previewDiv);
        });
    }
    
    // Remove file from selection
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        if (selectedFiles.length > 0) {
            displayPreviews();
        } else {
            previewContainer.classList.add('hidden');
        }
    };
    
    // Handle form submission
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (selectedFiles.length === 0) {
                showToast('Please select at least one file.', 'error');
                return;
            }
            
            const section = document.getElementById('upload-section').value;
            const category = document.getElementById('image-category').value;
            const description = document.getElementById('image-description').value;
            
            // Create organized file paths based on category
            const getImagePath = (fileName, category) => {
                if (section === 'gallery') {
                    return `gallery/${category}/${fileName}`;
                }
                return `uploaded_images/${fileName}`;
            };
            
            // Process each file
            selectedFiles.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imagePath = getImagePath(file.name, category);
                        
                        if (section === 'gallery') {
                            const galleryItem = createGalleryItem(imagePath, category, description || file.name, 'image', e.target.result);
                            galleryGrid.appendChild(galleryItem);
                        } else if (section === 'testimonials') {
                            const testimonialItem = createTestimonialItem(imagePath, description || file.name, 'image');
                            addToTestimonials(testimonialItem);
                        }
                        
                        // Save file info with organized path
                        saveFileToStorage(imagePath, section, category, description || file.name, file.name, 'image', e.target.result);
                        
                        // Create download link for user to save in correct folder
                        downloadFileToCorrectFolder(e.target.result, imagePath, file.name);
                    };
                    reader.readAsDataURL(file);
                } else if (file.type.startsWith('video/')) {
                    const videoUrl = URL.createObjectURL(file);
                    const videoPath = getImagePath(file.name, category);
                    
                    if (section === 'gallery') {
                        const galleryItem = createGalleryVideoItem(videoPath, category, description || file.name);
                        galleryGrid.appendChild(galleryItem);
                    } else if (section === 'testimonials') {
                        const testimonialItem = createTestimonialItem(videoPath, description || file.name, 'video');
                        addToTestimonials(testimonialItem);
                    }
                    saveFileToStorage(videoPath, section, category, description || file.name, file.name, 'video');
                }
            });
            // translator removed: no dynamic translation applied for newly-inserted elements

            showToast(`Successfully uploaded ${selectedFiles.length} file(s)! Please save the files in the correct folders as indicated.`, 'success');
            closeUploadModal();
        });
    }
    
    // Create gallery item HTML
    function createGalleryItem(imageSrc, category, description, type, base64Data = null) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-in-section cursor-pointer gallery-image-item';
        galleryItem.setAttribute('data-category', category);
        galleryItem.setAttribute('data-type', 'image');
        galleryItem.setAttribute('data-src', imageSrc);
        
        // Use base64 data for display if available, otherwise use the path
        const displaySrc = base64Data || imageSrc;
        
        galleryItem.innerHTML = `
            <div class="relative aspect-[4/3] overflow-hidden">
                <img src="${displaySrc}" alt="${description}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p class="text-white font-bold text-sm sm:text-base">${description}</p>
                </div>
            </div>
        `;
        
        // Add click event for lightbox
        galleryItem.addEventListener('click', function() {
            const src = base64Data || this.getAttribute('data-src');
            if (src) {
                galleryLightboxContent.innerHTML = `
                    <img src="${src}" alt="Gallery Image" class="w-full h-full object-contain">
                `;
                galleryLightbox.classList.remove('hidden');
                galleryLightbox.classList.add('flex');
                document.body.style.overflow = 'hidden';
            }
        });
        
        return galleryItem;
    }
    
    // Create gallery video item
    function createGalleryVideoItem(videoSrc, category, description) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-in-section cursor-pointer gallery-video-item';
        galleryItem.setAttribute('data-category', category);
        galleryItem.setAttribute('data-type', 'video');
        galleryItem.setAttribute('data-video-url', videoSrc);
        
        galleryItem.innerHTML = `
            <div class="relative aspect-[4/3] bg-gradient-to-br from-warm-orange/20 to-coral/20 overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center z-10">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-warm-orange" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
                <video class="w-full h-full object-cover opacity-50" muted>
                    <source src="${videoSrc}" type="video/mp4">
                </video>
                <div class="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p class="text-white font-bold text-sm sm:text-base">${description}</p>
                </div>
            </div>
        `;
        
        // Add click event for video modal
        galleryItem.addEventListener('click', function() {
            const videoUrl = this.getAttribute('data-video-url');
            if (videoUrl) {
                galleryLightboxContent.innerHTML = `
                    <video controls autoplay class="w-full h-full" style="object-fit: contain;">
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
                galleryLightbox.classList.remove('hidden');
                galleryLightbox.classList.add('flex');
                document.body.style.overflow = 'hidden';
            }
        });
        
        return galleryItem;
    }
    
    // Create testimonial item
    function createTestimonialItem(src, description, type) {
        const testimonialItem = document.createElement('div');
        testimonialItem.className = 'group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-in-section cursor-pointer testimonial-video';
        
        if (type === 'video') {
            testimonialItem.setAttribute('data-video-url', src);
            testimonialItem.innerHTML = `
                <div class="relative aspect-video bg-gradient-to-br from-warm-orange/10 to-coral/10 overflow-hidden">
                    <div class="absolute inset-0 flex items-center justify-center z-10">
                        <div class="w-20 h-20 sm:w-24 sm:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <svg class="w-10 h-10 sm:w-12 sm:h-12 text-warm-orange" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    </div>
                    <video class="w-full h-full object-cover opacity-30" muted>
                        <source src="${src}" type="video/mp4">
                    </video>
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="text-lg sm:text-xl font-poppins font-bold text-deep-green mb-2">User Testimonial</h3>
                    <p class="text-sm sm:text-base text-gray-600 mb-3">Video Testimonial</p>
                    <p class="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                        "${description}"
                    </p>
                </div>
            `;
        } else {
            testimonialItem.innerHTML = `
                <div class="relative aspect-video overflow-hidden">
                    <img src="${src}" alt="Testimonial" class="w-full h-full object-cover">
                </div>
                <div class="p-4 sm:p-6">
                    <h3 class="text-lg sm:text-xl font-poppins font-bold text-deep-green mb-2">User Testimonial</h3>
                    <p class="text-sm sm:text-base text-gray-600 mb-3">Image Testimonial</p>
                    <p class="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                        "${description}"
                    </p>
                </div>
            `;
        }
        
        return testimonialItem;
    }
    
    // Add to testimonials section
    function addToTestimonials(testimonialItem) {
        const testimonialsSection = document.querySelector('#testimonials .grid');
        if (testimonialsSection) {
            testimonialsSection.appendChild(testimonialItem);
        }
    }
    
    // Function to help users save files in correct folders
    function downloadFileToCorrectFolder(base64Data, filePath, originalFileName) {
        // Create a download link with the organized path name
        const link = document.createElement('a');
        link.href = base64Data;
        
        // Extract just the filename without extension for a clean download name
        const pathParts = filePath.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show instruction toast
        showToast(`File downloaded! Please save it to: ${filePath}`, 'info', 5000);
    }
    
    // Save file to localStorage
    function saveFileToStorage(src, section, category, description, fileName, type, base64Data = null) {
        try {
            const storageKey = section === 'gallery' ? 'gallery_files' : 'testimonial_files';
            const savedFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');
            savedFiles.push({
                src: src,
                section: section,
                category: category,
                description: description,
                fileName: fileName,
                type: type,
                base64Data: base64Data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem(storageKey, JSON.stringify(savedFiles));
        } catch (error) {
            console.warn('Could not save file to localStorage:', error);
        }
    }
    
    // Load saved files on page load
    function loadSavedFiles() {
        try {
            // Load gallery files
            const savedGalleryFiles = JSON.parse(localStorage.getItem('gallery_files') || '[]');
            savedGalleryFiles.forEach(file => {
                if (file.type === 'image') {
                    const galleryItem = createGalleryItem(file.src, file.category, file.description, 'image', file.base64Data);
                    galleryGrid.appendChild(galleryItem);
                } else if (file.type === 'video') {
                    const galleryItem = createGalleryVideoItem(file.src, file.category, file.description);
                    galleryGrid.appendChild(galleryItem);
                }
            });
            
            // Load testimonial files
            const savedTestimonialFiles = JSON.parse(localStorage.getItem('testimonial_files') || '[]');
            savedTestimonialFiles.forEach(file => {
                const testimonialItem = createTestimonialItem(file.src, file.description, file.type);
                addToTestimonials(testimonialItem);
            });
            // translator removed: no dynamic translation applied for loaded files
        } catch (error) {
            console.warn('Could not load saved files:', error);
        }
    }
    
    // Load saved files when page loads
    loadSavedFiles();
    
    // Scroll to donate function for cause modals
    window.scrollToDonate = function() {
        closeCauseModal();
        setTimeout(() => {
            const donateSection = document.getElementById('donate');
            if (donateSection) {
                donateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    };
    
    // Close modals on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (!videoModal.classList.contains('hidden')) {
                closeVideoModal();
            }
            if (!galleryLightbox.classList.contains('hidden')) {
                closeGalleryLightbox();
            }
            if (!causeModal.classList.contains('hidden')) {
                closeCauseModal();
            }
            if (!uploadModal.classList.contains('hidden')) {
                closeUploadModal();
            }
        }
    });
});