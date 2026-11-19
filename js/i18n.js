// ============================================================
// RoktoSeva — i18n engine (English ⇄ Bangla)
// - Source text in HTML/JS is English; Bangla is applied at runtime.
// - Default language comes from SITE_CONFIG.defaultLang (bn).
// - Text inside elements marked translate="no" (user content) is never touched.
// ============================================================
(function () {
  const PAIRS = [
    // ---------- Navigation / footer ----------
    ["Home", "হোম"], ["Requests", "অনুরোধ"], ["Search", "অনুসন্ধান"], ["Guidelines", "নির্দেশিকা"],
    ["FAQ", "প্রশ্নোত্তর"], ["Contact", "যোগাযোগ"], ["Login", "লগইন"], ["Register", "রেজিস্টার"],
    ["Dashboard", "ড্যাশবোর্ড"], ["Profile", "প্রোফাইল"], ["Logout", "লগআউট"], ["Donor", "রক্তদাতা"],
    ["User", "ব্যবহারকারী"], ["Blood Donation", "রক্তদান"], ["Search Donors", "ডোনার খুঁজুন"],
    ["Request Blood", "রক্তের অনুরোধ"], ["Donation Guidelines", "রক্তদান নির্দেশিকা"],
    ["Contact Us", "যোগাযোগ করুন"], ["Quick Links", "দ্রুত লিংক"], ["Live 24/7", "২৪/৭ সক্রিয়"],
    ["Developer", "ডেভেলপার"], ["Visit Portfolio", "পোর্টফোলিও দেখুন"], ["Developed by", "ডেভেলপ করেছেন"], ["All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।"],
    ["Built with care for lives that matter.", "জীবনের প্রতি যত্ন নিয়ে তৈরি।"],
    ["Bridging the gap between blood donors and recipients across Bangladesh through fast, decentralized coordination.",
     "দ্রুত ও সহজ সমন্বয়ের মাধ্যমে বাংলাদেশজুড়ে রক্তদাতা ও গ্রহীতাদের মধ্যে সেতুবন্ধন তৈরি করছি আমরা।"],
    ["Toggle language", "ভাষা পরিবর্তন"], ["Toggle Mobile Menu", "মেনু খুলুন"],
    ["Skip to content", "মূল অংশে যান"],

    // ---------- Home ----------
    ["Live Blood Network", "লাইভ রক্ত নেটওয়ার্ক"],
    ["Donate Blood", "রক্তদান করুন"], ["Inspire Lives!", "জীবনকে অনুপ্রাণিত করুন !"],
    ["RoktoSeva connects compassionate blood donors with patients in urgent need. Join a community dedicated to providing uninterrupted, immediate medical support.",
     "'রক্তসেবা' সহানুভূতিশীল রক্তদাতাদের জরুরি প্রয়োজনে থাকা রোগীদের সাথে সংযুক্ত করে। নিরবচ্ছিন্ন ও তাৎক্ষণিক চিকিৎসা সহায়তা প্রদানে নিবেদিত এমন একটি কমিউনিটিতে আপনিও যোগ দিন।"],
    ["Become a Donor", "ডোনার হোন"], ["Find Donors", "ডোনার খুঁজুন"],
    ["Active Donors", "সক্রিয় ডোনার"], ["Pending Requests", "অপেক্ষমাণ অনুরোধ"], ["Districts Covered", "জেলা কাভারেজ"],
    ["Scroll", "স্ক্রল করুন"],
    ["Simple process", "সহজ প্রক্রিয়া"], ["How it", "কীভাবে"], ["Works", "কাজ করে"],
    ["Three simple steps connect a patient with a donor.", "তিনটি সহজ ধাপে রোগী ও রক্তদাতার মধ্যে সংযোগ।"],
    ["Create your account", "অ্যাকাউন্ট তৈরি করুন"],
    ["Register in a minute with your blood group and location.", "রক্তের গ্রুপ ও ঠিকানা দিয়ে এক মিনিটেই রেজিস্টার করুন।"],
    ["Post or find", "অনুরোধ করুন বা খুঁজুন"],
    ["Post a blood request or search donors near you.", "রক্তের অনুরোধ করুন অথবা কাছের ডোনার খুঁজুন।"],
    ["Connect & save a life", "যোগাযোগ করে জীবন বাঁচান"],
    ["Contact each other directly and donate in time.", "সরাসরি যোগাযোগ করুন এবং সময়মতো রক্ত দিন।"],
    ["Emergency", "জরুরি"], ["Blood Requests", "রক্তের অনুরোধ"],
    ["Live pending requests from patients across Bangladesh. Filter by blood group or district.",
     "বাংলাদেশজুড়ে রোগীদের লাইভ অপেক্ষমাণ অনুরোধ। রক্তের গ্রুপ বা জেলা দিয়ে ফিল্টার করুন।"],
    ["All Blood Groups", "সব রক্তের গ্রুপ"], ["All Districts", "সব জেলা"],
    ["Available", "উপলব্ধ"], ["Donors", "ডোনার"],
    ["Recent registered donors ready to help across Bangladesh.", "বাংলাদেশজুড়ে সাহায্যের জন্য প্রস্তুত সাম্প্রতিক রেজিস্টার্ড ডোনার।"],
    ["View All Donors", "সব ডোনার দেখুন"],
    ["Know the eligibility criteria before you donate blood. Stay safe, save lives.", "রক্তদানের আগে যোগ্যতার শর্তগুলো জেনে নিন। নিরাপদ থাকুন, জীবন বাঁচান।"],
    ["Read Full Guidelines", "পূর্ণ নির্দেশিকা পড়ুন"],
    ["Frequently Asked", "সাধারণ"], ["Questions", "জিজ্ঞাসা"],
    ["Have questions about blood donation? Find answers here.", "রক্তদান নিয়ে প্রশ্ন আছে? এখানে উত্তর পাবেন।"],
    ["View All FAQs", "সব প্রশ্নোত্তর দেখুন"],
    ["Get In", "আমাদের সাথে"], ["Touch", "যোগাযোগ করুন"],
    ["Need help or have a suggestion? We are here 24/7.", "সাহায্য বা পরামর্শ লাগবে? আমরা ২৪/৭ আছি।"],
        ["Be someone's reason to live.", "কারও বেঁচে থাকার কারণ হোন।"],
    ["Join thousands of donors across Bangladesh today.", "আজই বাংলাদেশজুড়ে হাজারো ডোনারের সাথে যোগ দিন।"],
    ["Pending", "অপেক্ষমাণ"], ["Urgent", "জরুরি"], ["Normal", "সাধারণ"], ["Fulfilled", "সম্পন্ন"], ["Cancelled", "বাতিল"],
    ["Hospital", "হাসপাতাল"], ["Location", "ঠিকানা"], ["Date Needed", "প্রয়োজনের তারিখ"], ["Units", "ব্যাগ"], ["Age", "বয়স"],
    ["Find Matching Donors", "মিল থাকা ডোনার খুঁজুন"], ["Contact Requester", "অনুরোধকারীকে কল করুন"],
    ["Login to contact", "যোগাযোগের জন্য লগইন করুন"], ["Call now", "এখনই কল করুন"], ["Emergency contact", "জরুরি যোগাযোগ"],
    ["Patient", "রোগী"], ["Group", "গ্রুপ"], ["Last Donation", "সর্বশেষ রক্তদান"], ["Donations", "রক্তদান সংখ্যা"],
    ["No pending blood requests right now.", "এই মুহূর্তে কোনো অপেক্ষমাণ রক্তের অনুরোধ নেই।"],
    ["Post a request →", "অনুরোধ করুন →"], ["No donors yet. Be the first!", "এখনো কোনো ডোনার নেই। প্রথম হোন!"],
    ["Become a donor →", "ডোনার হোন →"], ["Register as donor →", "ডোনার হিসেবে রেজিস্টার করুন →"],
    ["Could not load requests. Check your connection.", "অনুরোধ লোড করা যায়নি। ইন্টারনেট সংযোগ দেখুন।"],
    ["Loading...", "লোড হচ্ছে..."], ["Never", "কখনো না"], ["Available", "উপলব্ধ"], ["Not Available", "উপলব্ধ নয়"], ["Unavailable", "অনুপলব্ধ"],
    ["Contact via Admin", "অ্যাডমিনের মাধ্যমে যোগাযোগ"],

    // ---------- Auth ----------
    ["Welcome", "স্বাগতম"], ["Back", "ফিরে আসুন"], ["Access the blood network", "রক্ত নেটওয়ার্কে প্রবেশ করুন"],
    ["Email Address", "ইমেইল ঠিকানা"], ["Password", "পাসওয়ার্ড"], ["Forgot Password?", "পাসওয়ার্ড ভুলে গেছেন?"],
    ["Don't have an account?", "অ্যাকাউন্ট নেই?"], ["Register Here", "এখানে রেজিস্টার করুন"],
    ["Signing in...", "সাইন ইন হচ্ছে..."], ["Join the", "যোগ দিন"], ["Network", "নেটওয়ার্কে"],
    ["Register as a blood donor", "রক্তদাতা হিসেবে রেজিস্টার করুন"],
    ["Profile Photo (optional, max 5MB)", "প্রোফাইল ছবি (ঐচ্ছিক, সর্বোচ্চ ৫MB)"],
    ["Full Name", "পূর্ণ নাম"], ["Phone (BD)", "ফোন (বাংলাদেশ)"], ["Gender", "লিঙ্গ"], ["Select Gender", "লিঙ্গ নির্বাচন করুন"],
    ["Male", "পুরুষ"], ["Female", "নারী"], ["Other", "অন্যান্য"],
    ["Guardian Phone (optional)", "অভিভাবকের ফোন (ঐচ্ছিক)"], ["Female donors: personal number stays hidden.", "নারী ডোনার: ব্যক্তিগত নম্বর গোপন থাকবে।"],
    ["Blood Group", "রক্তের গ্রুপ"], ["Select Blood Group", "রক্তের গ্রুপ নির্বাচন করুন"],
    ["District", "জেলা"], ["Select District", "জেলা নির্বাচন করুন"], ["Upazila", "উপজেলা"],
    ["Select District First", "আগে জেলা নির্বাচন করুন"], ["Select Upazila", "উপজেলা নির্বাচন করুন"],
    ["Donated Blood Before?", "আগে রক্ত দিয়েছেন?"], ["No, first time", "না, প্রথমবার"], ["Yes", "হ্যাঁ"], ["No", "না"],
    ["Last Donation Date", "সর্বশেষ রক্তদানের তারিখ"], ["Min 6 characters", "কমপক্ষে ৬ অক্ষর"],
    ["Confirm Password", "পাসওয়ার্ড নিশ্চিত করুন"], ["Already have an account?", "আগেই অ্যাকাউন্ট আছে?"], ["Login Here", "এখানে লগইন করুন"],
    ["I agree that my name, blood group and location will be visible to others on this platform.",
     "আমি সম্মত যে আমার নাম, রক্তের গ্রুপ ও ঠিকানা এই প্ল্যাটফর্মে অন্যদের কাছে দৃশ্যমান থাকবে।"],
    ["Creating Account...", "অ্যাকাউন্ট তৈরি হচ্ছে..."], ["Uploading photo...", "ছবি আপলোড হচ্ছে..."],

    // ---------- Search ----------
    ["Search", "অনুসন্ধান"], ["Blood Donors", "রক্তদাতা"], ["Find donors by blood group and location across Bangladesh.", "রক্তের গ্রুপ ও ঠিকানা অনুযায়ী বাংলাদেশজুড়ে ডোনার খুঁজুন।"],
    ["All Groups", "সব গ্রুপ"], ["All Upazilas", "সব উপজেলা"], ["Availability", "উপলব্ধতা"], ["All", "সব"], ["Available only", "শুধু উপলব্ধ"],
    ["Include compatible groups", "সামঞ্জস্যপূর্ণ গ্রুপসহ"],
    ["Select filters and click Search to find donors.", "ফিল্টার নির্বাচন করে অনুসন্ধান চাপুন।"],
    ["Searching...", "খোঁজা হচ্ছে..."], ["No donors found matching your criteria.", "আপনার শর্তে কোনো ডোনার পাওয়া যায়নি।"],
    ["Search failed. Please try again.", "অনুসন্ধান ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"],
    ["Show Phone", "ফোন দেখুন"], ["Call Donor", "ডোনারকে কল করুন"], ["Login to see contact", "যোগাযোগ দেখতে লগইন করুন"],
    ["Request Contact via Admin", "অ্যাডমিনের মাধ্যমে যোগাযোগের অনুরোধ"], ["Phone", "ফোন"],
    ["Hidden (Female donor)", "গোপন (নারী ডোনার)"], ["Please login first.", "আগে লগইন করুন।"],
    ["Contact request sent! Admin will connect you with the donor.", "অনুরোধ পাঠানো হয়েছে! অ্যাডমিন ডোনারের সাথে যোগাযোগ করিয়ে দেবেন।"],
    ["Could not load contact. Try again.", "যোগাযোগের তথ্য লোড করা যায়নি।"], ["Contact not available.", "যোগাযোগের তথ্য নেই।"],

    // ---------- Contact ----------
    ["Have a question, suggestion, or need help? Send us a message — we respond within 24 hours.", "প্রশ্ন, পরামর্শ বা সাহায্য লাগবে? মেসেজ পাঠান — ২৪ ঘণ্টার মধ্যে উত্তর দেব।"],
    ["Contact Info", "যোগাযোগের তথ্য"], ["Email", "ইমেইল"], ["Your Name", "আপনার নাম"], ["Subject", "বিষয়"], ["Message", "বার্তা"],
    ["Send Message", "বার্তা পাঠান"], ["Full name", "পূর্ণ নাম"], ["How can we help?", "কীভাবে সাহায্য করতে পারি?"],
    ["Write your message here...", "আপনার বার্তা এখানে লিখুন..."], ["Sending...", "পাঠানো হচ্ছে..."],
    ["Message sent successfully! We will reply soon.", "বার্তা পাঠানো হয়েছে! শীঘ্রই উত্তর দেব।"],
    ["Could not send message. Please try again.", "বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।"],
    ["Please wait a minute before sending another message.", "আরেকটি বার্তা পাঠানোর আগে এক মিনিট অপেক্ষা করুন।"],

    // ---------- Guidelines / FAQ ----------
    ["Everything you need to know to donate safely, recover quickly, and make the biggest impact.", "নিরাপদে রক্ত দিতে, দ্রুত সুস্থ হতে এবং সর্বোচ্চ প্রভাব রাখতে যা জানা দরকার।"],
    ["Blood Donation", "রক্তদান"], ["Eligibility", "যোগ্যতা"], ["Who Can", "কারা"], ["Donate?", "রক্ত দিতে পারেন?"],
    ["Age (Years)", "বয়স (বছর)"], ["Weight", "ওজন"], ["Hemoglobin (g/dL)", "হিমোগ্লোবিন (g/dL)"], ["90 Days", "৯০ দিন"], ["Between Donations", "দুই রক্তদানের ব্যবধান"],
    ["18–60", "১৮–৬০"], ["≥ 50 kg", "≥ ৫০ কেজি"], ["≥ 12.5", "≥ ১২.৫"], ["Step 01", "ধাপ ০১"], ["Step 02", "ধাপ ০২"], ["Step 03", "ধাপ ০৩"],
        ["Everything you need to know about RoktoSeva and blood donation.", "রক্তসেবা ও রক্তদান সম্পর্কে যা জানা দরকার।"],

    // ---------- Dashboard ----------
    ["Welcome back,", "স্বাগতম,"], ["Manage your donations, requests, and profile from here.", "এখান থেকে আপনার রক্তদান, অনুরোধ ও প্রোফাইল পরিচালনা করুন।"],
    ["My Requests", "আমার অনুরোধ"], ["Donations Made", "মোট রক্তদান"], ["Active", "সক্রিয়"], ["Status", "অবস্থা"],
    ["Create Request", "অনুরোধ তৈরি করুন"], ["Post a new blood donation request for a patient.", "রোগীর জন্য নতুন রক্তের অনুরোধ পোস্ট করুন।"],
    ["View and manage your active donation requests.", "আপনার সক্রিয় অনুরোধগুলো দেখুন ও পরিচালনা করুন।"],
    ["Find available donors by blood group and location.", "রক্তের গ্রুপ ও ঠিকানা দিয়ে উপলব্ধ ডোনার খুঁজুন।"],
    ["Live Requests", "লাইভ অনুরোধ"], ["Browse emergency requests from across Bangladesh.", "বাংলাদেশজুড়ে জরুরি অনুরোধগুলো দেখুন।"],
    ["My Profile", "আমার প্রোফাইল"], ["Update your personal info and blood group.", "ব্যক্তিগত তথ্য ও রক্তের গ্রুপ আপডেট করুন।"],
    ["Read blood donation eligibility guidelines.", "রক্তদানের যোগ্যতার নির্দেশিকা পড়ুন।"],
    ["Create", "তৈরি করুন"], ["Blood Request", "রক্তের অনুরোধ"], ["Fill in the patient details to post an emergency blood request.", "জরুরি রক্তের অনুরোধ করতে রোগীর তথ্য দিন।"],
    ["Patient Name", "রোগীর নাম"], ["Blood Group Needed", "প্রয়োজনীয় রক্তের গ্রুপ"], ["Select", "নির্বাচন করুন"],
    ["Hospital / Clinic", "হাসপাতাল / ক্লিনিক"], ["Urgency", "জরুরিতা"], ["Units Needed", "ব্যাগ সংখ্যা"], ["Patient Age (optional)", "রোগীর বয়স (ঐচ্ছিক)"],
    ["Contact Phone", "যোগাযোগের ফোন"], ["Emergency Contact Name", "জরুরি যোগাযোগকারীর নাম"], ["Additional Notes (optional)", "অতিরিক্ত নোট (ঐচ্ছিক)"],
    ["Post Request", "অনুরোধ পোস্ট করুন"], ["Posting...", "পোস্ট হচ্ছে..."], ["Patient full name", "রোগীর পূর্ণ নাম"], ["Hospital name", "হাসপাতালের নাম"],
    ["Relative / guardian name", "আত্মীয় / অভিভাবকের নাম"], ["Any special instructions...", "বিশেষ কোনো নির্দেশনা..."], ["e.g. 35", "যেমন ৩৫"],
    ["My", "আমার"], ["Track your blood donation requests.", "আপনার রক্তের অনুরোধগুলো ট্র্যাক করুন।"], ["+ New Request", "+ নতুন অনুরোধ"],
    ["Mark Fulfilled", "সম্পন্ন করুন"], ["Delete", "মুছুন"], ["Needed", "প্রয়োজন"],
    ["You have no active requests yet.", "আপনার এখনো কোনো অনুরোধ নেই।"], ["Create your first request →", "প্রথম অনুরোধ তৈরি করুন →"],
    ["Could not load your requests.", "আপনার অনুরোধ লোড করা যায়নি।"], ["Delete this request?", "এই অনুরোধটি মুছে ফেলবেন?"],
    ["Request updated.", "অনুরোধ আপডেট হয়েছে।"], ["Request deleted.", "অনুরোধ মুছে ফেলা হয়েছে।"], ["Action failed. Try again.", "কাজটি ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"],
    ["Donated Before", "আগে রক্ত দিয়েছেন"], ["Total Donations", "মোট রক্তদান"], ["Role", "ভূমিকা"], ["donor", "রক্তদাতা"],
    ["Phone (BD)", "ফোন (বাংলাদেশ)"], ["Donated Blood Before?", "আগে রক্ত দিয়েছেন?"],
    ["Save Changes", "পরিবর্তন সংরক্ষণ"], ["Cancel", "বাতিল"], ["Edit Profile", "প্রোফাইল সম্পাদনা"], ["Saving...", "সংরক্ষণ হচ্ছে..."],

    // ---------- Toasts / validation ----------
    ["Logged out successfully.", "সফলভাবে লগআউট হয়েছে।"], ["Login successful! Redirecting...", "লগইন সফল! রিডাইরেক্ট হচ্ছে..."],
    ["Please enter a valid email address.", "সঠিক ইমেইল ঠিকানা দিন।"], ["Please enter a valid email.", "সঠিক ইমেইল দিন।"],
    ["Password must be at least 6 characters.", "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"],
    ["Invalid email or password.", "ইমেইল বা পাসওয়ার্ড সঠিক নয়।"], ["Too many attempts. Try again later.", "অনেকবার চেষ্টা হয়েছে। পরে আবার চেষ্টা করুন।"],
    ["Login failed. Please try again.", "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"],
    ["Enter your email address first, then click Forgot Password.", "আগে ইমেইল লিখুন, তারপর 'পাসওয়ার্ড ভুলে গেছেন?' চাপুন।"],
    ["Password reset email sent! Check your inbox.", "পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে! ইনবক্স দেখুন।"],
    ["No account found with this email.", "এই ইমেইলে কোনো অ্যাকাউন্ট নেই।"], ["Could not send reset email.", "রিসেট ইমেইল পাঠানো যায়নি।"],
    ["Service is temporarily unavailable.", "সেবা সাময়িকভাবে বন্ধ আছে।"],
    ["Please enter your full name.", "আপনার পূর্ণ নাম দিন।"], ["Enter a valid BD phone (01XXXXXXXXX).", "সঠিক বাংলাদেশি ফোন নম্বর দিন (01XXXXXXXXX)।"],
    ["Enter a valid guardian phone (01XXXXXXXXX).", "অভিভাবকের সঠিক ফোন নম্বর দিন (01XXXXXXXXX)।"],
    ["Select your gender.", "লিঙ্গ নির্বাচন করুন।"], ["Select your blood group.", "রক্তের গ্রুপ নির্বাচন করুন।"], ["Select district and upazila.", "জেলা ও উপজেলা নির্বাচন করুন।"],
    ["Please enter your last donation date.", "সর্বশেষ রক্তদানের তারিখ দিন।"], ["Please enter last donation date.", "সর্বশেষ রক্তদানের তারিখ দিন।"],
    ["Passwords do not match!", "পাসওয়ার্ড মিলছে না!"], ["Please accept the consent to continue.", "চালিয়ে যেতে সম্মতি দিন।"],
    ["This email is already registered. Please login.", "এই ইমেইল আগেই রেজিস্টার্ড। লগইন করুন।"], ["Password is too weak.", "পাসওয়ার্ড দুর্বল।"],
    ["Registration failed. Please try again.", "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"], ["Account created! Redirecting...", "অ্যাকাউন্ট তৈরি হয়েছে! রিডাইরেক্ট হচ্ছে..."],
    ["Please select an image file.", "একটি ছবি নির্বাচন করুন।"], ["Image must be under 5MB.", "ছবি ৫MB এর কম হতে হবে।"], ["Please select a valid image file.", "সঠিক ছবি নির্বাচন করুন।"],
    ["Image upload failed.", "ছবি আপলোড ব্যর্থ হয়েছে।"], ["Photo upload failed. Continuing without photo.", "ছবি আপলোড ব্যর্থ। ছবি ছাড়াই চলছে।"],
    ["Please fill all required fields.", "সব আবশ্যক ঘর পূরণ করুন।"], ["Units needed must be at least 1.", "কমপক্ষে ১ ব্যাগ দরকার।"],
    ["Blood request posted successfully!", "রক্তের অনুরোধ সফলভাবে পোস্ট হয়েছে!"], ["Failed to post request.", "অনুরোধ পোস্ট করা যায়নি।"],
    ["Profile photo updated!", "প্রোফাইল ছবি আপডেট হয়েছে!"], ["Profile updated successfully!", "প্রোফাইল সফলভাবে আপডেট হয়েছে!"],
    ["Update failed.", "আপডেট ব্যর্থ হয়েছে।"], ["Phone", "ফোন"], ["Copied!", "কপি হয়েছে!"],

    // ---------- Google / profile completion ----------
    ["Continue with Google", "গুগল দিয়ে চালিয়ে যান"], ["Emergency? Sign in instantly", "জরুরি? সাথে সাথে সাইন ইন করুন"], ["or", "অথবা"],
    ["Google sign-in failed. Please try again.", "গুগল সাইন-ইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"],
    ["This domain is not authorized for Google sign-in.", "এই ডোমেইনে গুগল সাইন-ইন অনুমোদিত নয়।"],
    ["Google sign-in is not enabled yet.", "গুগল সাইন-ইন এখনো চালু করা হয়নি।"],
    ["Complete your donor profile", "আপনার ডোনার প্রোফাইল সম্পূর্ণ করুন"],
    ["Add your blood group and location so people can find you as a donor.", "রক্তের গ্রুপ ও ঠিকানা যোগ করুন, যাতে মানুষ আপনাকে ডোনার হিসেবে খুঁজে পায়।"],
    ["Complete Profile", "প্রোফাইল সম্পূর্ণ করুন"], ["Add your donor details", "আপনার ডোনার তথ্য যোগ করুন"],
    ["Profile saved! Redirecting...", "প্রোফাইল সংরক্ষিত হয়েছে! রিডাইরেক্ট হচ্ছে..."],

    // ---------- Donor profile page ----------
    ["Donor Profile", "ডোনার প্রোফাইল"], ["Donor not found", "ডোনার পাওয়া যায়নি"],
    ["This donor profile does not exist or was removed.", "এই ডোনার প্রোফাইল নেই অথবা মুছে ফেলা হয়েছে।"],
    ["Could not load this profile. Please try again.", "প্রোফাইল লোড করা যায়নি। আবার চেষ্টা করুন।"],
    ["View Profile →", "প্রোফাইল দেখুন →"], ["Back to search", "সার্চে ফিরুন"], ["years", "বছর"], ["Not provided", "দেওয়া হয়নি"],
    ["Donation History", "রক্তদানের ইতিহাস"], ["Next eligible date", "পরবর্তী রক্তদানের তারিখ"], ["Eligible now", "এখনই রক্ত দিতে পারবেন"],
    ["No donation recorded yet", "এখনো কোনো রক্তদান নথিভুক্ত নেই"], ["First time donor", "প্রথমবারের ডোনার"],
    ["Currently resting between donations", "বর্তমানে দুই রক্তদানের বিরতিতে আছেন"],
    ["Contact Donor", "ডোনারের সাথে যোগাযোগ"], ["WhatsApp", "হোয়াটসঅ্যাপ"],
    ["Phone is hidden to protect privacy. You can request contact through admin.", "গোপনীয়তা রক্ষায় ফোন নম্বর গোপন রাখা হয়েছে। অ্যাডমিনের মাধ্যমে যোগাযোগের অনুরোধ করতে পারেন।"],
    ["Admin Support", "অ্যাডমিন সাপোর্ট"], ["Need help reaching this donor? Our support team can assist you.", "ডোনারের সাথে যোগাযোগে সমস্যা হচ্ছে? আমাদের সাপোর্ট টিম সাহায্য করবে।"],
    ["Contact Admin Support", "অ্যাডমিন সাপোর্টে জানান"], ["Email Support", "ইমেইল সাপোর্ট"], ["Years", "বছর"],
    ["Age must be between 18 and 60.", "বয়স ১৮ থেকে ৬০ এর মধ্যে হতে হবে।"],
    ["I agree that my name, age, blood group and location will be visible to others on this platform.", "আমি সম্মত যে আমার নাম, বয়স, রক্তের গ্রুপ ও ঠিকানা এই প্ল্যাটফর্মে অন্যদের কাছে দৃশ্যমান থাকবে।"],
    ["Age", "বয়স"], ["Name", "নাম"],

    ["Admin Panel", "অ্যাডমিন প্যানেল"],
    // ---------- 404 ----------
    ["Page not found", "পেজ পাওয়া যায়নি"], ["The page you are looking for does not exist or was moved.", "আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা সরিয়ে নেওয়া হয়েছে।"],
    ["Back to Home", "হোমে ফিরুন"]
  ];

  const HTMLS = {
    before: { en: 'Before <span class="text-red-500">Donating</span>', bn: 'রক্তদানের <span class="text-red-500">আগে</span>' },
    during: { en: 'During <span class="text-red-500">Donation</span>', bn: 'রক্তদান <span class="text-red-500">চলাকালীন</span>' },
    complete: { en: 'Complete your <span class="text-red-500">Profile</span>', bn: 'প্রোফাইল <span class="text-red-500">সম্পূর্ণ করুন</span>' },
    after: { en: 'After <span class="text-red-500">Donating</span>', bn: 'রক্তদানের <span class="text-red-500">পরে</span>' }
  };

  const norm = (s) => s.replace(/\s+/g, " ").trim();
  const toBn = new Map(), toEn = new Map();
  PAIRS.forEach(([en, bn]) => { toBn.set(norm(en), bn); if (!toEn.has(norm(bn))) toEn.set(norm(bn), en); });

  const cfg = window.SITE_CONFIG || {};
  let lang = "bn";
  try { lang = localStorage.getItem("rs_lang") || cfg.defaultLang || "bn"; } catch { lang = cfg.defaultLang || "bn"; }
  if (lang !== "bn" && lang !== "en") lang = "bn";

  document.documentElement.lang = lang;
  document.documentElement.classList.add("i18n-pending");

  const lookup = (s, target) => {
    const k = norm(s);
    if (!k) return null;
    const m = target === "bn" ? toBn : toEn;
    return m.has(k) ? m.get(k) : null;
  };
  const t = (s) => (lang === "bn" ? lookup(s, "bn") ?? s : s);

  const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
  const fmtNum = (n) => (lang === "bn" ? String(n).replace(/\d/g, (d) => BN_DIGITS[d]) : String(n));
  const fmtDate = (v) => {
    if (!v) return null;
    const d = new Date(v);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT", "CODE"]);
  const ATTRS = ["placeholder", "title", "alt", "aria-label"];
  let applying = false;

  function skipEl(el) { return !el || SKIP.has(el.tagName) || !!(el.closest && el.closest('[translate="no"]')); }

  function translateTextNode(node) {
    if (skipEl(node.parentElement)) return;
    const m = node.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m || !m[2]) return;
    const tr = lookup(m[2], lang);
    if (tr !== null && tr !== m[2]) node.nodeValue = m[1] + tr + m[3];
  }
  function translateAttrs(el) {
    if (skipEl(el)) return;
    ATTRS.forEach((a) => {
      const v = el.getAttribute && el.getAttribute(a);
      if (v) { const tr = lookup(v, lang); if (tr !== null && tr !== v) el.setAttribute(a, tr); }
    });
  }
  function applyHtml(root) {
    const els = root.matches && root.matches("[data-h]") ? [root] : [];
    root.querySelectorAll && root.querySelectorAll("[data-h]").forEach((e) => els.push(e));
    els.forEach((el) => { const h = HTMLS[el.dataset.h]; if (h && el.innerHTML !== h[lang]) el.innerHTML = h[lang]; });
  }
  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === 1) applyHtml(root);
    if (root.nodeType === 3) { translateTextNode(root); return; }
    if (root.nodeType !== 1) return;
    translateAttrs(root);
    root.querySelectorAll("[placeholder],[title],[alt],[aria-label]").forEach(translateAttrs);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) translateTextNode(n);
  }
  function refreshNumbers() {
    document.querySelectorAll("[data-n]").forEach((el) => { el.textContent = fmtNum(el.dataset.n); });
  }
  function apply() {
    applying = true;
    translateTree(document.body);
    refreshNumbers();
    applying = false;
    document.documentElement.classList.remove("i18n-pending");
  }

  function setLang(l) {
    if (l !== "bn" && l !== "en") return;
    lang = l;
    try { localStorage.setItem("rs_lang", l); } catch {}
    document.documentElement.lang = l;
    apply();
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: l } }));
  }

  function start() {
    apply();
    new MutationObserver((muts) => {
      if (applying) return;
      applying = true;
      muts.forEach((m) => {
        if (m.type === "characterData") translateTextNode(m.target);
        else if (m.type === "attributes") translateAttrs(m.target);
        else m.addedNodes.forEach(translateTree);
      });
      applying = false;
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();

  window.i18n = { t, setLang, getLang: () => lang, fmtNum, fmtDate, apply, localized: (o) => (o && typeof o === "object" ? o[lang] || o.en || "" : o || "") };
  window.t = t;
})();
