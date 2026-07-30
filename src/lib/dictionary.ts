import type { Locale } from "@/lib/i18n";

const dictionaries = {
  en: {
    nav: {
      products: "Products",
      suppliers: "Suppliers",
      rfq: "RFQ",
      dashboard: "Dashboard",
      login: "Login",
      logout: "Sign out",
      join: "Join TMP",
      joinShort: "Join",
      backHome: "Back home",
    },
    contact: {
      contact: "Contact",
      title: "Contact the TMP team",
      body: "Speak directly with the administrator about joining the marketplace.",
      call: "Call the administrator",
      email: "Email the administrator",
      close: "Close contact details",
    },
    common: {
      verified: "Verified",
      verifiedSupplier: "Verified supplier",
      moq: "MOQ",
      response: "Response",
      requestQuote: "Request quote",
      backToSuppliers: "Back to suppliers",
      category: "Category",
      categories: "Categories",
      marketplace: "Marketplace",
      complete: "Complete",
      pending: "Pending",
      review: "Review",
      export: "Export",
      status: "Status",
      action: "Action",
      location: "Location",
      search: "Search",
      clearFilters: "Clear filters",
      all: "All",
      save: "Save",
      cancel: "Cancel",
      create: "Create",
      edit: "Edit",
      archive: "Archive",
      price: "Price",
      leadTime: "Lead time",
      supplier: "Supplier",
      product: "Product",
      units: "units",
      onRequest: "On request",
      uncategorized: "Uncategorized",
      generalSourcing: "General sourcing",
      home: "Home",
      privacy: "Privacy",
      terms: "Terms",
      goToProfile: "Go to profile",
    },
    footer: {
      intro:
        "TMP helps European buyers discover, compare, and request quotes from export-ready Turkish suppliers.",
      suppliers: "Suppliers",
      rfq: "Request a quote",
      buyerLogin: "Buyer login",
      supplierOnboarding: "Supplier onboarding",
      privacy: "Privacy",
      terms: "Terms",
      rights: "© 2026 TMP. All rights reserved.",
      note: "Built for sourcing validation, buyer trust, and supplier growth.",
    },
    home: {
      heroImageAlt: "Istanbul skyline, Bosphorus, and Galata Tower at night",
      badge: "Verified Turkish supply network for Europe",
      title: "Turkiye Market Place",
      subtitle:
        "Source textiles, machinery, food, home goods, building materials, and packaging from export-ready Turkish suppliers.",
      searchPlaceholder: "Search product, category, or supplier",
      headerSearchPlaceholder: "Search products or suppliers",
      allCategories: "All categories",
      startSourcing: "Start sourcing",
      popularSearches: "Popular searches",
      liveBoard: "Sourcing brief examples",
      marketplaceWelcome: "Welcome to TMP",
      categoriesForYou: "Categories for you",
      frequentlySearched: "Frequently searched",
      recommendedForBusiness: "Recommended for your business",
      businessTools: [
        "Request for quotation",
        "Verified manufacturers",
        "Fast customization",
      ],
      guaranteedTitle: "TMP Guaranteed",
      guaranteedItems: [
        "Structured RFQs",
        "Verified supplier signals",
        "Quote follow-up support",
      ],
      exploreNow: "Explore now",
      featuredSuppliers: "Featured suppliers",
      featuredTitle: "Export-ready partners with visible credibility.",
      exploreSuppliers: "Explore suppliers",
      featuredCategories: "Featured categories",
      categoriesTitle:
        "Built around the categories European buyers already source from Turkiye.",
      categoriesBody:
        "Browse a focused supplier network shaped around practical buyer signals: category fit, capacity, certifications, export markets, and response speed.",
      benefitVerificationTitle: "Verification-first profiles",
      benefitVerificationBody:
        "Certification, export markets, response speed, and supplier readiness sit close to every RFQ path.",
      benefitEuropeTitle: "Designed for EU sourcing",
      benefitEuropeBody:
        "Buyers can compare categories, MOQs, private label capacity, and country-specific export experience.",
      benefitGrowthTitle: "Supplier growth engine",
      benefitGrowthBody:
        "Turkish manufacturers get a premium digital presence built for buyer trust and conversion.",
      verificationBadge: "Supplier verification",
      verificationTitle: "Turn supplier credibility into buyer confidence.",
      verificationItems: [
        "Export readiness review",
        "Certification display",
        "Verified badge placement",
      ],
      trustMetrics: [
        "Product categories",
        "Listed suppliers",
        "Published products",
      ],
      applySupplier: "Apply as supplier",
    },
    suppliers: {
      badge: "Supplier directory",
      title: "Search Turkish suppliers built for European sourcing teams.",
      body: "Compare verified status, categories, export markets, minimum order quantities, and response speed before sending an RFQ.",
      indexed: "suppliers indexed",
      indexedSingular: "supplier indexed",
      filters: "Filters",
      search: "Search",
      searchPlaceholder: "Textile, CNC, packaging",
      allCategories: "All categories",
      verification: "Verification",
      checks: ["Verified suppliers", "EU export experience", "Low MOQ"],
      viewSupplier: "View supplier",
      emptyTitle: "No suppliers match these filters",
      emptyBody:
        "Try a broader search, clear a filter, or browse the full supplier directory.",
    },
    products: {
      badge: "Product discovery",
      title: "Browse Turkish-made products ready for European sourcing.",
      body: "Search published supplier listings by product, category, supplier, MOQ, price range, and lead time.",
      indexed: "published products",
      indexedSingular: "published product",
      filters: "Filters",
      searchPlaceholder: "Denim jackets, CNC housing, olive oil...",
      allCategories: "All categories",
      allSuppliers: "All suppliers",
      emptyTitle: "No published products found",
      emptyBody:
        "Try a broader search or check back as suppliers publish more listings.",
      verified: "Verified supplier",
      quote: "Quote",
      viewProduct: "View product",
      productDetails: "Product details",
      supplierInfo: "Supplier information",
      related: "More from this supplier",
      requestQuote: "Request quote",
      backToProducts: "Back to products",
      notConfigured:
        "Supabase products are not configured in this environment yet.",
      metadataTitle: "Product Discovery | TMP",
      metadataDescription:
        "Browse published Turkish supplier products by search, category, supplier, MOQ, price range, and lead time.",
      detailFallbackTitle: "Product | TMP",
      detailFallbackDescription: "TMP product detail.",
      metadataFromSupplier: "from",
      metadataMoq: "MOQ",
      seoKeywords: [
        "Turkish products",
        "B2B product sourcing",
        "supplier products",
        "Turkey export products",
        "European sourcing",
      ],
      detailSeoKeywords: [
        "Turkish supplier product",
        "B2B RFQ",
        "Turkey export sourcing",
      ],
    },
    supplierDetail: {
      founded: "Founded",
      team: "Team",
      productCatalog: "Product catalog",
      previewProducts: "Preview products",
      viewAllProducts: "View all supplier products",
      certifications: "Certifications",
      licenses: "Licenses & audits",
      exportMarkets: "Export markets",
      metadataNotFoundTitle: "Supplier not found | TMP",
      metadataNotFoundDescription: "This supplier profile is not available.",
      metadataVerifiedTitle: "Verified Turkish Supplier",
      metadataBasedIn: "Based in",
      metadataCategory: "Category",
      seoKeywords: [
        "verified Turkish supplier",
        "Turkey manufacturer",
        "B2B sourcing",
      ],
    },
    rfq: {
      badge: "Request for quote",
      title: "Send one sourcing brief. Reach the right Turkish suppliers.",
      body: "Share the details suppliers need to evaluate fit, prepare pricing, and respond with a useful next step.",
      bullets: [
        "Product specifications",
        "Target quantity and destination",
        "Optional drawings or reference files",
      ],
      requesterName: "Your name",
      requesterNamePlaceholder: "Aylin Demir",
      requesterEmail: "Email for supplier replies",
      requesterEmailPlaceholder: "you@company.com",
      requesterCompany: "Company (optional)",
      requesterCompanyPlaceholder: "Company name",
      signInRequiredTitle: "Sign in before sending an RFQ",
      signInRequiredBody:
        "A TMP account keeps your request private, lets you add attachments, and gives suppliers a verified reply address.",
      signInToSubmit: "Sign in to submit",
      productRequest: "Product specification",
      productPlaceholder:
        "Organic cotton hoodie, 320gsm fleece, OEKO-TEX, 500 pcs",
      productHelp:
        'Include product type, material or spec, certification need, and target quantity. Vague requests like "hoodies" or "boxes" are hard to route.',
      selectCategory: "Select category",
      quantity: "Quantity",
      quantityPlaceholder: "500 units",
      destinationCountry: "Destination country",
      selectCountry: "Select country",
      destinationCountries: [
        "Germany",
        "Netherlands",
        "France",
        "Spain",
        "Italy",
        "United Kingdom",
      ],
      timeline: "Target timeline",
      timelinePlaceholder: "Sample in 3 weeks",
      notes: "Notes / message",
      notesPlaceholder:
        "Share materials, certifications, packaging, Incoterms, and any existing supplier benchmark.",
      upload: "Upload attachment",
      uploadHelp:
        "Private PDF, JPG, PNG, or WebP up to 10 MB. Only TMP reviewers can access it.",
      uploadSignIn:
        "Sign in to add a private technical drawing, reference image, or specification sheet.",
      submit: "Submit RFQ",
      status: {
        success: "RFQ submitted. Our sourcing team will review it shortly.",
        missing:
          "Please add a product request, quantity, and destination country.",
        specific:
          "Please make the product request more specific with material, spec, certification, or target quantity.",
        context:
          "That product, supplier, or category is no longer available. Please choose a current marketplace option.",
        config: "Supabase is not configured for this environment yet.",
        notification:
          "The RFQ was saved, but we could not send the email notification. Please contact TMP support.",
        attachmentAuth: "Sign in before adding a private attachment.",
        attachment:
          "Use a valid PDF, JPG, PNG, or WebP attachment no larger than 10 MB.",
        error: "We could not submit the RFQ. Please try again.",
      },
      metadataTitle: "Submit an RFQ | TMP",
      metadataDescription:
        "Send a structured sourcing request to Turkish suppliers with product, quantity, destination country, and attachment details.",
    },
    auth: {
      welcomeBack: "Welcome back",
      loginTitle: "Continue with your TMP account.",
      loginBody:
        "One account lets you source as a buyer, manage RFQs, and add a supplier profile when you are ready to sell on TMP.",
      supplierLoginTitle: "Sign in to start your supplier upgrade.",
      supplierLoginBody:
        "Use your existing TMP account to add company details and unlock supplier tools. Paid verification is optional.",
      buyerLogin: "Buyer login",
      supplierLogin: "Supplier login",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot password?",
      forgotPasswordTitle: "Reset your password",
      forgotPasswordBody:
        "Enter your account email. If an account exists, TMP will send a secure reset link.",
      sendResetLink: "Send reset link",
      backToLogin: "Back to login",
      resetPasswordTitle: "Choose a new password",
      resetPasswordBody:
        "Use at least 8 characters. Your reset link must still be active.",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      updatePassword: "Update password",
      login: "Login",
      supplierLoginCta: "Continue to supplier upgrade",
      newToTmp: "New to TMP?",
      createAccount: "Create an account",
      supplierCreateAccount: "Create account and continue",
      onboarding: "TMP onboarding",
      registerTitle: "Create one TMP account. Add supplier access when ready.",
      supplierRegisterTitle: "Create your TMP account to start selling.",
      supplierRegisterBody:
        "Next you will add your supplier profile and publish products from the same account. Paid verification can be added separately.",
      accountPath: "One TMP account",
      accountPathBody:
        "Browse suppliers, send RFQs, and manage sourcing from one login.",
      supplierUpgradePath: "Supplier profile upgrade",
      supplierUpgradePathBody:
        "After creating an account, add company details and publish products. Verification is an optional paid upgrade.",
      supplierStepAccount: "1. Create or sign in",
      supplierStepAccountBody:
        "Use one TMP login for buying, sourcing, and supplier tools.",
      supplierStepUpgrade: "2. Add supplier upgrade",
      supplierStepUpgradeBody:
        "Add company details and publish products. Add paid verification when you want the badge.",
      buyerPath: "Buyer path",
      buyerPathBody: "Send RFQs and shortlist suppliers.",
      supplierPath: "Supplier path",
      supplierPathBody:
        "Add a supplier profile and publish products. Verification is optional.",
      accountTitle: "TMP account",
      accountBody:
        "Buyer sourcing is included by default. Supplier access can be added from the same account.",
      supplierAccountTitle: "Step 1: TMP account",
      supplierAccountBody:
        "Create or sign in to the same account you will use for sourcing and supplier tools.",
      supplierIntentTitle: "Step 2: Supplier upgrade",
      supplierIntentBody:
        "After sign-in, add company details and start publishing. Paid verification is optional.",
      buyerAccount: "Buyer account",
      supplierAccount: "Supplier profile",
      fullName: "Full name",
      company: "Company",
      workEmail: "Work email",
      primaryRole: "Primary role",
      selectRole: "Select role",
      buyer: "Buyer",
      supplier: "Supplier",
      continueWithGoogle: "Continue with Google",
      supplierContinueWithGoogle: "Continue with Google",
      googleHelp:
        "Use Google to continue with one TMP account. Supplier setup happens after sign-in.",
      supplierGoogleHelp:
        "Continue with one TMP account. Supplier profile setup happens next; paid verification is optional.",
      orEmail: "or continue with email",
      alreadyAccount: "Already have an account?",
      status: {
        missing: "Please complete the required fields.",
        error: "Authentication failed. Please try again.",
        checkEmail:
          "Check your email to confirm the account before logging in.",
        authRequired: "Sign in to continue to your account.",
        oauthNotReady:
          "Google sign-in could not start. Please try again or continue with email.",
        passwordUpdated: "Password updated. You can now sign in.",
        resetSent:
          "If an account exists for that email, a secure reset link is on its way.",
        invalidEmail: "Enter a valid email address.",
        resetError: "The reset link could not be completed. Request a new one.",
        resetExpired: "This reset session has expired. Request a new link.",
        passwordMismatch:
          "Use matching passwords between 8 and 128 characters.",
      },
    },
    dashboard: {
      eyebrow: "Supplier workspace",
      title: "Dashboard",
      description:
        "Track supplier visibility, inbound RFQs, product inquiries, and verification readiness.",
      previewData: "Preview pipeline",
      previewBody:
        "Dashboard counts and rows are staged examples until live RFQs and supplier analytics are connected.",
      overview: "Overview",
      products: "Products",
      profile: "Profile",
      listings: "Listings",
      rfqs: "RFQs",
      productInquiries: "Product inquiries",
      verification: "Verification",
      verificationSettings: "Verification settings",
      metrics: [
        "Active listings",
        "Open RFQs",
        "Product inquiries",
        "Verification",
      ],
      supplierRequestRows: [
        ["Organic cotton basics", "Germany", "500 units", "New"],
        ["Rigid cosmetics boxes", "France", "2,000 units", "Review"],
        ["CNC aluminum housing", "Italy", "100 units", "Quoted"],
      ],
      readinessRows: [
        ["Company documents", "Complete"],
        ["Certifications", "Needs review"],
        ["Factory photos", "Complete"],
        ["Export references", "Pending"],
      ],
      recentRequests: "Recent buyer requests",
      profileReadiness: "Profile readiness",
      buyerActivity: "Buyer activity",
      nextActions: "Next actions",
      manageProducts: "Manage products",
      reviewProducts: "Review listings",
      listingsBody:
        "Keep published products accurate with MOQ, price range, lead time, and category details.",
      productInquiriesBody:
        "Product inquiries will appear beside the listings they came from once supplier RFQ routing is enabled.",
      nextActionsBody:
        "Prepare verification and product quality signals before buyer traffic increases.",
      upgradeTitle: "Upgrade to Verified Supplier",
      upgradeBody:
        "Start the monthly verification subscription and submit documents for admin review.",
      upgradeCta: "Open verification settings",
      buyerWorkspace: {
        eyebrow: "Buyer workspace",
        description:
          "Track RFQs, saved suppliers, product shortlists, and product inquiries.",
        metrics: [
          "Open RFQs",
          "Saved suppliers",
          "Product inquiries",
          "Shortlisted products",
        ],
        activeRequests: "Active sourcing requests",
        createRfq: "Create RFQ",
        requestRows: [
          ["Organic cotton basics", "Matching suppliers", "3 replies"],
          ["Rigid cosmetics boxes", "Reviewing quotes", "2 replies"],
          ["CNC aluminum housing", "Draft request", "Not sent"],
        ],
        discovery: "Supplier discovery",
        continueSourcing: "Continue sourcing",
        discoveryBody:
          "Browse verified Turkish suppliers, compare product listings, and send a structured RFQ when you are ready.",
        browseProducts: "Browse products",
        exploreSuppliers: "Explore suppliers",
        savedSuppliers: "Saved suppliers",
        productInquiries: "Product inquiries",
        savedSuppliersBody:
          "Compare trusted suppliers by category, location, MOQ, and response speed.",
        productInquiriesBody:
          "Browse published products and start a quote request from the exact item you need.",
        nextActionsBody:
          "Create a structured RFQ with quantity, destination, timing, and sourcing notes.",
      },
      productManager: {
        eyebrow: "Supplier products",
        title: "Products",
        description:
          "Create, publish, and maintain the product listings buyers discover on TMP.",
        createProduct: "Create product",
        editProduct: "Edit product",
        noProducts: "No supplier products yet",
        noProductsBody:
          "Create a first product listing to make it available for marketplace discovery once published.",
        loginRequired: "Login required",
        loginRequiredBody:
          "Sign in to your TMP account and add a supplier profile before managing product listings.",
        supplierMissing: "Supplier profile needed",
        supplierMissingBody:
          "Your TMP account does not have supplier tools enabled yet. Upgrade from Profile to unlock product publishing.",
        productTitle: "Product title",
        category: "Category",
        productDescription: "Description",
        minimumOrderQuantity: "Minimum order quantity",
        priceMin: "Minimum price",
        priceMax: "Maximum price",
        currency: "Currency",
        leadTime: "Lead time",
        images: "Images",
        leadTimePlaceholder: "2-4 weeks",
        imageHelp:
          "Upload one JPG, PNG, or WebP image up to 5 MB. TMP stores it securely with your supplier account.",
        replaceImage:
          "Choose a new JPG, PNG, or WebP file only when you want to replace the current image.",
        imageError: "Add a valid JPG, PNG, or WebP image no larger than 5 MB.",
        status: "Status",
        draft: "Draft",
        published: "Published",
        archived: "Archived",
        saveDraft: "Save product",
        updateProduct: "Update product",
        tableProduct: "Product",
        tableCategory: "Category",
        tablePricing: "Pricing",
        tableUpdated: "Created",
        supplierAccessRequired: "Supplier access required",
        supplierAccessCreateBody:
          "Add a supplier profile before creating supplier product listings. You can keep browsing products or submit a sourcing request from the same account.",
        supplierAccessEditBody:
          "Add a supplier profile before editing supplier product listings.",
        supplierAccessBody:
          "Product posting is available after adding a supplier profile. Your TMP account can still browse products, save suppliers, and submit RFQs.",
        browseProducts: "Browse products",
        successCreate: "Product created.",
        successUpdate: "Product updated.",
        successArchive: "Product archived.",
        missing: "Please add a title, category, description, and status.",
        error: "We could not save the product. Please try again.",
      },
      metadataTitle: "Dashboard | TMP",
      metadataDescription:
        "TMP workspace for RFQs, product discovery, and supplier tools.",
      productMetadataTitle: "Supplier Products | TMP",
      productMetadataDescription:
        "Create and manage TMP supplier product listings.",
      createProductMetadataTitle: "Create Product | TMP",
      createProductMetadataDescription:
        "Create a supplier product listing on TMP.",
      editProductMetadataTitle: "Edit Product | TMP",
      editProductMetadataDescription: "Edit a TMP supplier product listing.",
    },
    profileSettings: {
      eyebrow: "Account profile",
      title: "Profile",
      description:
        "Manage your TMP account, supplier upgrade, and verified badge membership.",
      accountTitle: "Account",
      email: "Email",
      accountType: "Account type",
      buyerAccount: "Buyer account",
      supplierAccount: "Supplier account",
      supplierEnabled: "Supplier tools enabled",
      supplierUpgradeTitle: "Upgrade to supplier",
      supplierUpgradeBody:
        "Add basic business details to unlock supplier tools. This does not charge you or add a verified badge.",
      businessName: "Business name",
      startSupplierUpgrade: "Upgrade to supplier",
      supplierReadyTitle: "Supplier profile",
      supplierReadyBody:
        "Your account has supplier tools enabled. You can manage product listings and choose whether to pay for verification.",
      verifiedTitle: "Verified badge membership",
      verifiedBody:
        "The verified badge is a paid monthly membership. Start or manage the subscription when you want the badge and verification review.",
      verifiedLockedBody:
        "First upgrade to a supplier by adding your business name. Then you can start the paid membership for a verified badge.",
      verificationSettings: "Verification settings",
      manageProducts: "Manage products",
      businessNamePlaceholder: "Anatolia Distribution",
      metadataTitle: "Profile | TMP",
      metadataDescription:
        "Manage your TMP profile, supplier upgrade, and verification.",
    },
    verificationSettings: {
      eyebrow: "Supplier verification",
      title: "Verification settings",
      description:
        "Manage the monthly verification subscription, submit business documents, and prepare your supplier profile for admin approval.",
      overview: "Verification overview",
      currentStatus: "Verification status",
      subscriptionStatus: "Subscription status",
      benefits: "Verification benefits",
      benefitItems: [
        "Verified badge on supplier and product cards",
        "Increased buyer trust during RFQ review",
        "Better visibility in marketplace discovery",
        "Access to future premium supplier features",
      ],
      subscription: "Monthly subscription",
      price: "€1 / month",
      priceNote:
        "Introductory monthly verification subscription for distributor onboarding and Stripe testing.",
      subscribe: "Start subscription",
      manage: "Manage subscription",
      documents: "Business verification",
      documentsBody:
        "Upload private business documents for admin review. Files are stored securely and are not public marketplace assets.",
      supplierAccessTitle: "Add a supplier profile",
      supplierAccessBody:
        "Your TMP account can source as a buyer by default. Add company details to unlock supplier tools; paid verification is optional.",
      supplierCompany: "Supplier company",
      startSupplierProfile: "Start supplier upgrade",
      businessLicense: "Business license",
      companyRegistration: "Company registration",
      certifications: "Certifications",
      documentRequired: "Required. PDF, JPG, PNG, or WebP up to 10 MB.",
      documentOptional: "Optional. PDF, JPG, PNG, or WebP up to 10 MB.",
      documentUploaded:
        "Uploaded securely. Choose a new file only to replace it.",
      notes: "Notes for review",
      submitDocuments: "Submit for review",
      statusSubmitted: "Verification documents submitted for admin review.",
      statusSupplierStarted:
        "Supplier profile started. You can publish products now and add paid verification when ready.",
      statusMissingCompany: "Please add a supplier company name.",
      statusDocumentError:
        "Add valid business license and company registration files. Use PDF, JPG, PNG, or WebP files up to 10 MB.",
      statusError:
        "We could not update verification details. Please try again.",
      checkoutPlaceholder:
        "Checkout placeholder opened. Stripe is ready to connect when credentials are added.",
      checkoutSuccess:
        "Checkout completed. Stripe will confirm the subscription by webhook.",
      checkoutCancelled: "Checkout cancelled. No subscription was started.",
      checkoutError:
        "Stripe checkout could not be created. Check the subscription environment variables.",
      billingActionError:
        "Stripe billing could not be opened. Please try again in a moment.",
      preparing: "Preparing...",
      opening: "Opening...",
      portalPlaceholder:
        "Customer portal placeholder opened. Live portal sessions will work after Stripe is configured.",
      portalMissingCustomer:
        "Start a verification subscription before opening the customer portal.",
      portalError:
        "Stripe customer portal could not be opened. Please try again.",
      missingSupplier:
        "Create or connect a supplier profile before verification.",
      loginRequired: "Sign in to add or manage a supplier profile.",
      states: {
        none: "Not started",
        pending: "Pending review",
        verified: "Verified",
        rejected: "Rejected",
        inactive: "Inactive",
        active: "Active",
        past_due: "Past due",
        canceled: "Canceled",
      },
      metadataTitle: "Verification Settings | TMP",
      metadataDescription:
        "Manage TMP supplier verification and billing settings.",
    },
    admin: {
      eyebrow: "Admin console",
      title: "Supplier approvals",
      description:
        "Review supplier applications, verification status, documents, and marketplace readiness.",
      pendingApprovals: "Pending approvals",
      verifiedSuppliers: "Verified suppliers",
      queuedChecks: "Queued checks",
      approvalTable: "Approval table",
      queue: "Supplier verification queue",
      supplier: "Supplier",
      risk: "Risk",
      documentChecks: "Document checks",
      controls: "Marketplace controls",
      notes: "Approval notes",
      notesBody:
        "Keep reviewer notes close to approval decisions, verification evidence, category quality, and supplier readiness signals.",
    },
    legal: {
      lastUpdated: "Last updated: May 16, 2026.",
      privacyBadge: "Privacy",
      privacyTitle: "Privacy Policy",
      privacyIntro:
        "This policy explains how TMP handles information while building a trusted B2B sourcing marketplace.",
      privacyMetadataTitle: "Privacy Policy | TMP",
      privacyMetadataDescription:
        "Privacy policy for TMP, a B2B sourcing marketplace connecting European buyers with Turkish suppliers.",
      privacySections: [
        [
          "Information We Collect",
          "TMP may collect account details, company information, RFQ submissions, supplier profile content, product listings, verification materials, contact details, and basic usage data needed to operate the marketplace.",
        ],
        [
          "How We Use Information",
          "We use information to provide marketplace access, route RFQs, manage supplier listings, support verification workflows, improve the product, prevent abuse, and communicate service updates.",
        ],
        [
          "Authentication",
          "TMP uses Supabase Auth and may offer Google sign-in. When you authenticate with Google, we receive the account information required to create or access your TMP profile, such as email address and basic profile details.",
        ],
        [
          "Suppliers And Buyers",
          "Published supplier and product information may be visible publicly. RFQs and verification documents are intended to remain private and are protected by database access controls.",
        ],
        [
          "Service Providers",
          "We use third-party providers such as Supabase, Vercel, Google, and future payment providers to host, authenticate, secure, analyze, and operate the service.",
        ],
        [
          "Data Retention",
          "We keep information while it is needed for marketplace operations, legal requirements, security, and legitimate business purposes. Users may request updates or deletion where applicable.",
        ],
        [
          "Contact",
          "For privacy questions or data requests, contact the TMP team through the official marketplace contact channel. A dedicated privacy inbox may be added as the company setup matures.",
        ],
      ],
      termsBadge: "Terms",
      termsTitle: "Terms of Service",
      termsIntro:
        "These terms outline the baseline rules for using TMP during the marketplace MVP and validation phase.",
      termsMetadataTitle: "Terms of Service | TMP",
      termsMetadataDescription:
        "Terms of service for TMP, a B2B sourcing marketplace for European buyers and Turkish suppliers.",
      termsSections: [
        [
          "Marketplace Role",
          "TMP provides a digital marketplace for sourcing discovery, RFQ submission, supplier profiles, and product listings. TMP is not automatically a party to buyer-supplier transactions unless a separate written agreement says otherwise.",
        ],
        [
          "Accounts",
          "Users are responsible for accurate account information, authorized access to their company profile, and keeping login credentials secure. Buyer and supplier access may differ based on role and verification status.",
        ],
        [
          "Supplier Listings",
          "Suppliers are responsible for keeping product listings, company details, certifications, pricing ranges, lead times, and minimum order quantities accurate and lawful.",
        ],
        [
          "RFQs",
          "Buyers are responsible for submitting accurate sourcing requirements. RFQ responses, pricing, samples, contracts, logistics, customs, and payments are handled between the buyer and supplier unless TMP later offers managed services.",
        ],
        [
          "Verification",
          "Verification features are designed to increase buyer trust, but they do not guarantee supplier performance, product quality, regulatory compliance, or transaction outcomes. Final verification decisions remain subject to TMP review.",
        ],
        [
          "Acceptable Use",
          "Users may not submit fraudulent, illegal, infringing, abusive, misleading, or harmful content, and may not attempt to bypass marketplace security, Row Level Security, or access controls.",
        ],
        [
          "Changes",
          "TMP may update these terms as the marketplace evolves. Continued use of the service after updates means the user accepts the updated terms.",
        ],
      ],
    },
    notFound: {
      metadataTitle: "Page Not Found | TMP",
      title: "This route is still being sourced.",
      body: "The page may have moved, or it is waiting for the next marketplace sprint.",
      cta: "Return home",
    },
    metadata: {
      rootTitle: "TMP | Turkiye Market Place",
      rootDescription:
        "A premium B2B sourcing marketplace connecting European buyers with verified Turkish suppliers.",
      loginTitle: "Login | TMP",
      loginDescription: "Access your TMP account.",
      registerTitle: "Register | TMP",
      registerDescription:
        "Create one TMP account for sourcing and supplier setup.",
    },
  },
  fr: {
    nav: {
      products: "Produits",
      suppliers: "Fournisseurs",
      rfq: "Demande",
      dashboard: "Tableau",
      login: "Connexion",
      logout: "Déconnexion",
      join: "Rejoindre TMP",
      joinShort: "Rejoindre",
      backHome: "Retour",
    },
    contact: {
      contact: "Contact",
      title: "Contacter l’équipe TMP",
      body: "Échangez directement avec l’administrateur pour rejoindre la marketplace.",
      call: "Appeler l’administrateur",
      email: "Écrire à l’administrateur",
      close: "Fermer les coordonnées",
    },
    common: {
      verified: "Vérifié",
      verifiedSupplier: "Fournisseur vérifié",
      moq: "MOQ",
      response: "Réponse",
      requestQuote: "Demander un devis",
      backToSuppliers: "Retour aux fournisseurs",
      category: "Catégorie",
      categories: "Catégories",
      marketplace: "Marketplace",
      complete: "Complet",
      pending: "En attente",
      review: "Revoir",
      export: "Exporter",
      status: "Statut",
      action: "Action",
      location: "Localisation",
      search: "Rechercher",
      clearFilters: "Effacer les filtres",
      all: "Tout",
      save: "Enregistrer",
      cancel: "Annuler",
      create: "Créer",
      edit: "Modifier",
      archive: "Archiver",
      price: "Prix",
      leadTime: "Délai",
      supplier: "Fournisseur",
      product: "Produit",
      units: "unités",
      onRequest: "Sur demande",
      uncategorized: "Non catégorisé",
      generalSourcing: "Sourcing général",
      home: "Accueil",
      privacy: "Confidentialité",
      terms: "Conditions",
      goToProfile: "Aller au profil",
    },
    footer: {
      intro:
        "TMP aide les acheteurs européens à découvrir, comparer et demander des devis auprès de fournisseurs turcs prêts pour l’export.",
      suppliers: "Fournisseurs",
      rfq: "Demander un devis",
      buyerLogin: "Connexion acheteur",
      supplierOnboarding: "Inscription fournisseur",
      privacy: "Confidentialité",
      terms: "Conditions",
      rights: "© 2026 TMP. Tous droits réservés.",
      note: "Conçu pour valider le sourcing, renforcer la confiance et accélérer la croissance fournisseur.",
    },
    home: {
      heroImageAlt:
        "Vue nocturne d’Istanbul, du Bosphore et de la tour de Galata",
      badge: "Réseau de fournisseurs turcs vérifiés pour l’Europe",
      title: "Turkiye Market Place",
      subtitle:
        "Sourcez textiles, machines, produits alimentaires, maison, matériaux de bâtiments et emballages auprès de fournisseurs turcs prêts pour l’export.",
      searchPlaceholder:
        "Rechercher un produit, une catégorie ou un fournisseur",
      headerSearchPlaceholder: "Rechercher produits ou fournisseurs",
      allCategories: "Toutes les catégories",
      startSourcing: "Lancer le sourcing",
      popularSearches: "Recherches populaires",
      liveBoard: "Exemples de briefs sourcing",
      marketplaceWelcome: "Bienvenue sur TMP",
      categoriesForYou: "Catégories pour vous",
      frequentlySearched: "Souvent recherché",
      recommendedForBusiness: "Recommandé pour votre activité",
      businessTools: [
        "Demande de devis",
        "Fabricants vérifiés",
        "Personnalisation rapide",
      ],
      guaranteedTitle: "TMP Guaranteed",
      guaranteedItems: [
        "Demandes structurées",
        "Signaux fournisseur vérifiés",
        "Suivi des devis",
      ],
      exploreNow: "Explorer",
      featuredSuppliers: "Fournisseurs à la une",
      featuredTitle: "Des partenaires export avec une crédibilité visible.",
      exploreSuppliers: "Explorer les fournisseurs",
      featuredCategories: "Catégories à la une",
      categoriesTitle:
        "Structuré autour des catégories que les acheteurs européens sourcent déjà en Turquie.",
      categoriesBody:
        "Parcourez un réseau de fournisseurs axé sur les bons signaux acheteurs : catégorie, capacité, certifications, marchés export et vitesse de réponse.",
      benefitVerificationTitle: "Profils orientés vérification",
      benefitVerificationBody:
        "Certifications, marchés export, vitesse de réponse et maturité fournisseur restent proches de chaque parcours RFQ.",
      benefitEuropeTitle: "Pensé pour le sourcing européen",
      benefitEuropeBody:
        "Les acheteurs comparent catégories, MOQ, capacité marque privée et expérience export par pays.",
      benefitGrowthTitle: "Moteur de croissance fournisseur",
      benefitGrowthBody:
        "Les industriels turcs obtiennent une présence digitale premium conçue pour la confiance et la conversion.",
      verificationBadge: "Vérification fournisseur",
      verificationTitle:
        "Transformez la crédibilité fournisseur en confiance acheteur.",
      verificationItems: [
        "Revue de maturité export",
        "Affichage des certifications",
        "Badge vérifié visible",
      ],
      trustMetrics: [
        "Catégories produits",
        "Fournisseurs listés",
        "Produits publiés",
      ],
      applySupplier: "Candidater comme fournisseur",
    },
    suppliers: {
      badge: "Annuaire fournisseurs",
      title:
        "Recherchez des fournisseurs turcs conçus pour les équipes sourcing européennes.",
      body: "Comparez statut vérifié, catégories, marchés export, quantités minimales et vitesse de réponse avant d’envoyer une demande.",
      indexed: "fournisseurs indexés",
      indexedSingular: "fournisseur indexé",
      filters: "Filtres",
      search: "Recherche",
      searchPlaceholder: "Textile, CNC, emballage",
      allCategories: "Toutes les catégories",
      verification: "Vérification",
      checks: ["Fournisseurs vérifiés", "Expérience export UE", "MOQ faible"],
      viewSupplier: "Voir le fournisseur",
      emptyTitle: "Aucun fournisseur ne correspond à ces filtres",
      emptyBody:
        "Essayez une recherche plus large, effacez un filtre ou parcourez tout l’annuaire fournisseur.",
    },
    products: {
      badge: "Découverte produits",
      title:
        "Parcourez des produits fabriqués en Turquie, prêts pour le sourcing européen.",
      body: "Recherchez les listings publiés par produit, catégorie, fournisseur, MOQ, prix et délai.",
      indexed: "produits publiés",
      indexedSingular: "produit publié",
      filters: "Filtres",
      searchPlaceholder: "Vestes denim, boîtier CNC, huile d’olive...",
      allCategories: "Toutes les catégories",
      allSuppliers: "Tous les fournisseurs",
      emptyTitle: "Aucun produit publié trouvé",
      emptyBody:
        "Essayez une recherche plus large ou revenez lorsque les fournisseurs publient plus de listings.",
      verified: "Fournisseur vérifié",
      quote: "Devis",
      viewProduct: "Voir le produit",
      productDetails: "Détails produit",
      supplierInfo: "Informations fournisseur",
      related: "Autres produits du fournisseur",
      requestQuote: "Demander un devis",
      backToProducts: "Retour aux produits",
      notConfigured:
        "Les produits Supabase ne sont pas encore configurés dans cet environnement.",
      metadataTitle: "Découverte produits | TMP",
      metadataDescription:
        "Parcourez les produits publiés de fournisseurs turcs par recherche, catégorie, fournisseur, MOQ, prix et délai.",
      detailFallbackTitle: "Produit | TMP",
      detailFallbackDescription: "Détail produit TMP.",
      metadataFromSupplier: "par",
      metadataMoq: "MOQ",
      seoKeywords: [
        "produits turcs",
        "sourcing produit B2B",
        "produits fournisseurs",
        "produits export Turquie",
        "sourcing européen",
      ],
      detailSeoKeywords: [
        "produit fournisseur turc",
        "RFQ B2B",
        "sourcing export Turquie",
      ],
    },
    supplierDetail: {
      founded: "Fondée",
      team: "Équipe",
      productCatalog: "Catalogue produits",
      previewProducts: "Aperçu des produits",
      viewAllProducts: "Voir tous les produits du fournisseur",
      certifications: "Certifications",
      licenses: "Licences et audits",
      exportMarkets: "Marchés export",
      metadataNotFoundTitle: "Fournisseur introuvable | TMP",
      metadataNotFoundDescription:
        "Ce profil fournisseur n’est pas disponible.",
      metadataVerifiedTitle: "Fournisseur turc vérifié",
      metadataBasedIn: "Basé à",
      metadataCategory: "Catégorie",
      seoKeywords: [
        "fournisseur turc vérifié",
        "fabricant Turquie",
        "sourcing B2B",
      ],
    },
    rfq: {
      badge: "Demande de devis",
      title: "Envoyez un brief sourcing. Touchez les bons fournisseurs turcs.",
      body: "Partagez les détails nécessaires pour évaluer l’adéquation, préparer un prix et répondre avec une prochaine étape utile.",
      bullets: [
        "Spécifications produit",
        "Quantité cible et destination",
        "Plans ou fichiers de référence optionnels",
      ],
      requesterName: "Votre nom",
      requesterNamePlaceholder: "Aylin Demir",
      requesterEmail: "E-mail pour les réponses fournisseurs",
      requesterEmailPlaceholder: "vous@entreprise.com",
      requesterCompany: "Entreprise (optionnel)",
      requesterCompanyPlaceholder: "Nom de l’entreprise",
      signInRequiredTitle: "Connectez-vous avant d’envoyer une demande",
      signInRequiredBody:
        "Un compte TMP protège votre demande, permet d’ajouter des pièces jointes et fournit aux fournisseurs une adresse de réponse vérifiée.",
      signInToSubmit: "Se connecter pour envoyer",
      productRequest: "Specification produit",
      productPlaceholder: "Sweat coton bio, molleton 320gsm, OEKO-TEX, 500 pcs",
      productHelp:
        'Ajoutez le type de produit, la matiere ou specification, la certification souhaitee et la quantite cible. Les demandes vagues comme "sweats" ou "boites" sont difficiles a router.',
      selectCategory: "Sélectionner une catégorie",
      quantity: "Quantité",
      quantityPlaceholder: "500 unités",
      destinationCountry: "Pays de destination",
      selectCountry: "Sélectionner un pays",
      destinationCountries: [
        "Allemagne",
        "Pays-Bas",
        "France",
        "Espagne",
        "Italie",
        "Royaume-Uni",
      ],
      timeline: "Calendrier cible",
      timelinePlaceholder: "Échantillon sous 3 semaines",
      notes: "Notes / message",
      notesPlaceholder:
        "Partagez matériaux, certifications, emballage, Incoterms et références existantes.",
      upload: "Ajouter une pièce jointe",
      uploadHelp:
        "PDF, JPG, PNG ou WebP privé de 10 Mo maximum. Seuls les reviewers TMP peuvent y accéder.",
      uploadSignIn:
        "Connectez-vous pour ajouter un plan technique, une image de référence ou un cahier des charges privé.",
      submit: "Envoyer la demande",
      status: {
        success: "Demande envoyée. Notre équipe sourcing va l’examiner.",
        missing:
          "Veuillez ajouter une demande produit, une quantité et un pays de destination.",
        specific:
          "Veuillez preciser la demande produit avec matiere, specification, certification ou quantite cible.",
        context:
          "Ce produit, fournisseur ou cette catégorie n’est plus disponible. Veuillez choisir une option actuelle de la marketplace.",
        config: "Supabase n’est pas encore configuré pour cet environnement.",
        notification:
          "La demande a été enregistrée, mais la notification email n’a pas pu être envoyée. Veuillez contacter le support TMP.",
        attachmentAuth:
          "Connectez-vous avant d’ajouter une pièce jointe privée.",
        attachment:
          "Utilisez un fichier PDF, JPG, PNG ou WebP valide de 10 Mo maximum.",
        error: "Impossible d’envoyer la demande. Veuillez réessayer.",
      },
      metadataTitle: "Envoyer une RFQ | TMP",
      metadataDescription:
        "Envoyez une demande de sourcing structurée aux fournisseurs turcs avec produit, quantité, pays de destination et pièces jointes.",
    },
    auth: {
      welcomeBack: "Bon retour",
      loginTitle: "Continuez avec votre compte TMP.",
      loginBody:
        "Un seul compte permet de sourcer comme acheteur, gérer les demandes et ajouter un profil fournisseur quand vous êtes prêt à vendre sur TMP.",
      supplierLoginTitle: "Connectez-vous pour lancer l’upgrade fournisseur.",
      supplierLoginBody:
        "Utilisez votre compte TMP pour ajouter la société et débloquer les outils fournisseur. La vérification payante est facultative.",
      buyerLogin: "Connexion acheteur",
      supplierLogin: "Connexion fournisseur",
      email: "Email",
      password: "Mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      forgotPasswordTitle: "Réinitialiser votre mot de passe",
      forgotPasswordBody:
        "Saisissez l’email du compte. Si un compte existe, TMP enverra un lien sécurisé.",
      sendResetLink: "Envoyer le lien",
      backToLogin: "Retour à la connexion",
      resetPasswordTitle: "Choisissez un nouveau mot de passe",
      resetPasswordBody:
        "Utilisez au moins 8 caractères. Votre lien doit encore être actif.",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      updatePassword: "Mettre à jour le mot de passe",
      login: "Connexion",
      supplierLoginCta: "Continuer vers l’upgrade fournisseur",
      newToTmp: "Nouveau sur TMP ?",
      createAccount: "Créer un compte",
      supplierCreateAccount: "Créer le compte et continuer",
      onboarding: "Onboarding TMP",
      registerTitle:
        "Créez un compte TMP. Ajoutez l’accès fournisseur quand vous êtes prêt.",
      supplierRegisterTitle: "Créez votre compte TMP pour commencer à vendre.",
      supplierRegisterBody:
        "Ensuite, ajoutez votre profil fournisseur et publiez vos produits depuis le même compte. La vérification payante reste facultative.",
      accountPath: "Un compte TMP",
      accountPathBody:
        "Parcourez les fournisseurs, envoyez des demandes et gérez le sourcing depuis une seule connexion.",
      supplierUpgradePath: "Profil fournisseur",
      supplierUpgradePathBody:
        "Après création du compte, ajoutez la société et publiez vos produits. La vérification est une option payante.",
      supplierStepAccount: "1. Créer ou se connecter",
      supplierStepAccountBody:
        "Utilisez une seule connexion TMP pour acheter, sourcer et gérer les outils fournisseur.",
      supplierStepUpgrade: "2. Ajouter l’upgrade fournisseur",
      supplierStepUpgradeBody:
        "Ajoutez la société et publiez vos produits. Activez la vérification payante pour obtenir le badge.",
      buyerPath: "Parcours acheteur",
      buyerPathBody: "Envoyez des demandes et sélectionnez des fournisseurs.",
      supplierPath: "Parcours fournisseur",
      supplierPathBody:
        "Ajoutez un profil fournisseur et publiez vos produits. La vérification est facultative.",
      accountTitle: "Compte TMP",
      accountBody:
        "Le sourcing acheteur est inclus par défaut. L’accès fournisseur s’ajoute au même compte.",
      supplierAccountTitle: "Étape 1 : compte TMP",
      supplierAccountBody:
        "Créez ou connectez-vous au même compte utilisé pour le sourcing et les outils fournisseur.",
      supplierIntentTitle: "Étape 2 : upgrade fournisseur",
      supplierIntentBody:
        "Après connexion, ajoutez la société et commencez à publier. La vérification payante est facultative.",
      buyerAccount: "Compte acheteur",
      supplierAccount: "Profil fournisseur",
      fullName: "Nom complet",
      company: "Entreprise",
      workEmail: "Email professionnel",
      primaryRole: "Rôle principal",
      selectRole: "Sélectionner un rôle",
      buyer: "Acheteur",
      supplier: "Fournisseur",
      continueWithGoogle: "Continuer avec Google",
      supplierContinueWithGoogle: "Continuer avec Google",
      googleHelp:
        "Utilisez Google pour continuer avec un seul compte TMP. Le profil fournisseur se configure après connexion.",
      supplierGoogleHelp:
        "Continuez avec un seul compte TMP. Le profil fournisseur se configure ensuite; la vérification payante est facultative.",
      orEmail: "ou continuer avec email",
      alreadyAccount: "Vous avez déjà un compte ?",
      status: {
        missing: "Veuillez compléter les champs requis.",
        error: "L’authentification a échoué. Veuillez réessayer.",
        checkEmail:
          "Vérifiez votre email pour confirmer le compte avant de vous connecter.",
        authRequired: "Connectez-vous pour accéder à votre compte.",
        oauthNotReady:
          "La connexion Google n’a pas pu démarrer. Réessayez ou continuez avec l’e-mail.",
        passwordUpdated:
          "Mot de passe mis à jour. Vous pouvez maintenant vous connecter.",
        resetSent:
          "Si un compte existe pour cet email, un lien sécurisé est en cours d’envoi.",
        invalidEmail: "Saisissez une adresse email valide.",
        resetError:
          "Le lien n’a pas pu être utilisé. Demandez un nouveau lien.",
        resetExpired: "Cette session a expiré. Demandez un nouveau lien.",
        passwordMismatch:
          "Utilisez deux mots de passe identiques de 8 à 128 caractères.",
      },
    },
    dashboard: {
      eyebrow: "Espace fournisseur",
      title: "Tableau de bord",
      description:
        "Suivez visibilité, demandes entrantes, demandes produit et préparation à la vérification.",
      previewData: "Pipeline preview",
      previewBody:
        "Les compteurs et lignes du dashboard sont des exemples tant que les RFQ et analytics fournisseurs ne sont pas connectes.",
      overview: "Vue d’ensemble",
      products: "Produits",
      profile: "Profil",
      listings: "Listings",
      rfqs: "Demandes",
      productInquiries: "Demandes produit",
      verification: "Vérification",
      verificationSettings: "Paramètres vérification",
      metrics: [
        "Listings actifs",
        "Demandes ouvertes",
        "Demandes produit",
        "Vérification",
      ],
      supplierRequestRows: [
        ["Basiques coton bio", "Allemagne", "500 unités", "Nouveau"],
        ["Boîtes cosmétiques rigides", "France", "2 000 unités", "Revue"],
        ["Boîtier aluminium CNC", "Italie", "100 unités", "Devis reçu"],
      ],
      readinessRows: [
        ["Documents société", "Complet"],
        ["Certifications", "À revoir"],
        ["Photos usine", "Complet"],
        ["Références export", "En attente"],
      ],
      recentRequests: "Demandes acheteurs récentes",
      profileReadiness: "Préparation du profil",
      buyerActivity: "Activité acheteur",
      nextActions: "Prochaines actions",
      manageProducts: "Gérer les produits",
      reviewProducts: "Revoir les listings",
      listingsBody:
        "Gardez les produits publiés à jour avec MOQ, prix, délai et catégorie.",
      productInquiriesBody:
        "Les demandes produit apparaîtront près des listings associés une fois le routage fournisseur activé.",
      nextActionsBody:
        "Préparez les signaux de vérification et de qualité avant l’augmentation du trafic acheteur.",
      upgradeTitle: "Passer en fournisseur vérifié",
      upgradeBody:
        "Lancez l’abonnement mensuel de vérification et soumettez vos documents pour revue admin.",
      upgradeCta: "Ouvrir la vérification",
      buyerWorkspace: {
        eyebrow: "Espace acheteur",
        description:
          "Suivez vos demandes, fournisseurs enregistrés, produits présélectionnés et demandes produit.",
        metrics: [
          "Demandes ouvertes",
          "Fournisseurs enregistrés",
          "Demandes produit",
          "Produits présélectionnés",
        ],
        activeRequests: "Demandes de sourcing actives",
        createRfq: "Créer une demande",
        requestRows: [
          [
            "Basiques coton bio",
            "Fournisseurs en correspondance",
            "3 réponses",
          ],
          ["Boîtes cosmétiques rigides", "Devis en revue", "2 réponses"],
          ["Boîtier aluminium CNC", "Demande brouillon", "Non envoyé"],
        ],
        discovery: "Découverte fournisseurs",
        continueSourcing: "Continuer le sourcing",
        discoveryBody:
          "Parcourez les fournisseurs turcs vérifiés, comparez les listings produits et envoyez une demande structurée quand vous êtes prêt.",
        browseProducts: "Parcourir les produits",
        exploreSuppliers: "Explorer les fournisseurs",
        savedSuppliers: "Fournisseurs enregistrés",
        productInquiries: "Demandes produit",
        savedSuppliersBody:
          "Comparez les fournisseurs fiables par catégorie, localisation, MOQ et vitesse de réponse.",
        productInquiriesBody:
          "Parcourez les produits publiés et lancez une demande depuis l’article exact recherché.",
        nextActionsBody:
          "Créez une RFQ structurée avec quantité, destination, calendrier et notes de sourcing.",
      },
      productManager: {
        eyebrow: "Produits fournisseur",
        title: "Produits",
        description:
          "Créez, publiez et maintenez les listings produits découverts par les acheteurs sur TMP.",
        createProduct: "Créer un produit",
        editProduct: "Modifier le produit",
        noProducts: "Aucun produit fournisseur",
        noProductsBody:
          "Créez un premier listing produit pour le rendre découvrable une fois publié.",
        loginRequired: "Connexion requise",
        loginRequiredBody:
          "Connectez-vous à votre compte TMP et ajoutez un profil fournisseur avant de gérer les listings produits.",
        supplierMissing: "Profil fournisseur requis",
        supplierMissingBody:
          "Votre compte TMP n’a pas encore les outils fournisseur activés. Passez par le profil pour débloquer la publication.",
        productTitle: "Titre du produit",
        category: "Catégorie",
        productDescription: "Description",
        minimumOrderQuantity: "Quantité minimale",
        priceMin: "Prix minimum",
        priceMax: "Prix maximum",
        currency: "Devise",
        leadTime: "Délai",
        images: "Images",
        leadTimePlaceholder: "2-4 semaines",
        imageHelp:
          "Importez une image JPG, PNG ou WebP de 5 Mo maximum. TMP la stocke de façon sécurisée avec votre compte fournisseur.",
        replaceImage:
          "Choisissez un nouveau fichier JPG, PNG ou WebP uniquement pour remplacer l’image actuelle.",
        imageError:
          "Ajoutez une image JPG, PNG ou WebP valide de 5 Mo maximum.",
        status: "Statut",
        draft: "Brouillon",
        published: "Publié",
        archived: "Archivé",
        saveDraft: "Enregistrer le produit",
        updateProduct: "Mettre à jour",
        tableProduct: "Produit",
        tableCategory: "Catégorie",
        tablePricing: "Prix",
        tableUpdated: "Créé",
        supplierAccessRequired: "Accès fournisseur requis",
        supplierAccessCreateBody:
          "Ajoutez un profil fournisseur avant de créer des listings produits. Vous pouvez continuer à parcourir les produits ou envoyer une demande de sourcing avec le même compte.",
        supplierAccessEditBody:
          "Ajoutez un profil fournisseur avant de modifier les listings produits.",
        supplierAccessBody:
          "La publication produit est disponible après ajout d’un profil fournisseur. Votre compte TMP peut toujours parcourir les produits, enregistrer des fournisseurs et envoyer des demandes.",
        browseProducts: "Parcourir les produits",
        successCreate: "Produit créé.",
        successUpdate: "Produit mis à jour.",
        successArchive: "Produit archivé.",
        missing:
          "Veuillez ajouter un titre, une catégorie, une description et un statut.",
        error: "Impossible d’enregistrer le produit. Veuillez réessayer.",
      },
      metadataTitle: "Tableau de bord | TMP",
      metadataDescription:
        "Espace TMP pour les RFQ, la découverte produit et les outils fournisseur.",
      productMetadataTitle: "Produits fournisseur | TMP",
      productMetadataDescription:
        "Créez et gérez les listings produits fournisseur TMP.",
      createProductMetadataTitle: "Créer un produit | TMP",
      createProductMetadataDescription:
        "Créez un listing produit fournisseur sur TMP.",
      editProductMetadataTitle: "Modifier le produit | TMP",
      editProductMetadataDescription:
        "Modifiez un listing produit fournisseur TMP.",
    },
    profileSettings: {
      eyebrow: "Profil du compte",
      title: "Profil",
      description:
        "Gérez votre compte TMP, l’upgrade fournisseur et l’abonnement au badge vérifié.",
      accountTitle: "Compte",
      email: "Email",
      accountType: "Type de compte",
      buyerAccount: "Compte acheteur",
      supplierAccount: "Compte fournisseur",
      supplierEnabled: "Outils fournisseur activés",
      supplierUpgradeTitle: "Passer en fournisseur",
      supplierUpgradeBody:
        "Ajoutez les informations de base de l’entreprise pour débloquer les outils fournisseur. Cela ne vous facture pas et n’ajoute pas de badge vérifié.",
      businessName: "Nom de l’entreprise",
      startSupplierUpgrade: "Passer en fournisseur",
      supplierReadyTitle: "Profil fournisseur",
      supplierReadyBody:
        "Votre compte a les outils fournisseur activés. Vous pouvez gérer les listings produits et choisir de payer pour la vérification.",
      verifiedTitle: "Abonnement badge vérifié",
      verifiedBody:
        "Le badge vérifié est un abonnement mensuel payant. Lancez ou gérez l’abonnement quand vous voulez le badge et la revue de vérification.",
      verifiedLockedBody:
        "Passez d’abord en fournisseur en ajoutant le nom de l’entreprise. Vous pourrez ensuite démarrer l’abonnement payant pour le badge vérifié.",
      verificationSettings: "Paramètres de vérification",
      manageProducts: "Gérer les produits",
      businessNamePlaceholder: "Anatolia Distribution",
      metadataTitle: "Profil | TMP",
      metadataDescription:
        "Gérez votre profil TMP, l’upgrade fournisseur et la vérification.",
    },
    verificationSettings: {
      eyebrow: "Vérification fournisseur",
      title: "Paramètres de vérification",
      description:
        "Gérez l’abonnement mensuel de vérification, soumettez les documents d’entreprise et préparez le profil pour l’approbation admin.",
      overview: "Vue d’ensemble",
      currentStatus: "Statut de vérification",
      subscriptionStatus: "Statut d’abonnement",
      benefits: "Bénéfices de la vérification",
      benefitItems: [
        "Badge vérifié sur les cartes fournisseur et produit",
        "Plus de confiance acheteur pendant la revue RFQ",
        "Meilleure visibilité dans la découverte marketplace",
        "Accès aux futures fonctions premium fournisseur",
      ],
      subscription: "Abonnement mensuel",
      price: "1 € / mois",
      priceNote:
        "Abonnement mensuel de lancement pour l’onboarding distributeur et le test Stripe.",
      subscribe: "Démarrer l’abonnement",
      manage: "Gérer l’abonnement",
      documents: "Vérification entreprise",
      documentsBody:
        "Importez des documents d’entreprise privés pour la revue admin. Les fichiers sont stockés de façon sécurisée et ne sont pas publics.",
      supplierAccessTitle: "Ajouter un profil fournisseur",
      supplierAccessBody:
        "Votre compte TMP permet le sourcing acheteur par défaut. Ajoutez la société pour débloquer les outils fournisseur; la vérification payante est facultative.",
      supplierCompany: "Société fournisseur",
      startSupplierProfile: "Démarrer l’upgrade fournisseur",
      businessLicense: "Licence commerciale",
      companyRegistration: "Immatriculation société",
      certifications: "Certifications",
      documentRequired: "Obligatoire. PDF, JPG, PNG ou WebP de 10 Mo maximum.",
      documentOptional: "Facultatif. PDF, JPG, PNG ou WebP de 10 Mo maximum.",
      documentUploaded:
        "Importé en toute sécurité. Choisissez un nouveau fichier uniquement pour le remplacer.",
      notes: "Notes pour la revue",
      submitDocuments: "Soumettre pour revue",
      statusSubmitted: "Documents soumis pour revue admin.",
      statusSupplierStarted:
        "Profil fournisseur démarré. Vous pouvez publier maintenant et ajouter la vérification payante ensuite.",
      statusMissingCompany:
        "Veuillez ajouter le nom de la société fournisseur.",
      statusDocumentError:
        "Ajoutez une licence commerciale et une immatriculation valides. Utilisez des fichiers PDF, JPG, PNG ou WebP de 10 Mo maximum.",
      statusError:
        "Impossible de mettre à jour les détails de vérification. Veuillez réessayer.",
      checkoutPlaceholder:
        "Placeholder Checkout ouvert. Stripe sera connecté dès que les identifiants seront ajoutés.",
      checkoutSuccess:
        "Checkout terminé. Stripe confirmera l’abonnement via webhook.",
      checkoutCancelled: "Checkout annulé. Aucun abonnement n’a été lancé.",
      checkoutError:
        "Impossible de créer le checkout Stripe. Vérifiez les variables d’environnement.",
      billingActionError:
        "Impossible d’ouvrir la facturation Stripe. Veuillez réessayer dans un instant.",
      preparing: "Préparation...",
      opening: "Ouverture...",
      portalPlaceholder:
        "Placeholder portail client ouvert. Les sessions live fonctionneront après configuration Stripe.",
      portalMissingCustomer:
        "Lancez un abonnement de vérification avant d’ouvrir le portail client.",
      portalError:
        "Impossible d’ouvrir le portail client Stripe. Veuillez réessayer.",
      missingSupplier:
        "Créez ou connectez un profil fournisseur avant la vérification.",
      loginRequired:
        "Connectez-vous pour ajouter ou gérer un profil fournisseur.",
      states: {
        none: "Non démarré",
        pending: "En revue",
        verified: "Vérifié",
        rejected: "Rejeté",
        inactive: "Inactif",
        active: "Actif",
        past_due: "En retard",
        canceled: "Annulé",
      },
      metadataTitle: "Paramètres de vérification | TMP",
      metadataDescription:
        "Gérez la vérification fournisseur TMP et les paramètres de facturation.",
    },
    admin: {
      eyebrow: "Console admin",
      title: "Approbations fournisseurs",
      description:
        "Examinez candidatures, statut de vérification, documents et maturité marketplace.",
      pendingApprovals: "Approbations en attente",
      verifiedSuppliers: "Fournisseurs vérifiés",
      queuedChecks: "Contrôles en file",
      approvalTable: "Table d’approbation",
      queue: "File de vérification fournisseur",
      supplier: "Fournisseur",
      risk: "Risque",
      documentChecks: "Contrôles documents",
      controls: "Contrôles marketplace",
      notes: "Notes d’approbation",
      notesBody:
        "Gardez les notes reviewer proches des décisions, preuves, qualité catégorie et signaux de maturité.",
    },
    legal: {
      lastUpdated: "Dernière mise à jour : 16 mai 2026.",
      privacyBadge: "Confidentialité",
      privacyTitle: "Politique de confidentialité",
      privacyIntro:
        "Cette politique explique comment TMP traite les informations pendant la construction d’une marketplace B2B de sourcing fiable.",
      privacyMetadataTitle: "Politique de confidentialité | TMP",
      privacyMetadataDescription:
        "Politique de confidentialité de TMP, marketplace B2B reliant les acheteurs européens aux fournisseurs turcs.",
      privacySections: [
        [
          "Informations collectées",
          "TMP peut collecter les informations de compte, données d’entreprise, soumissions RFQ, contenus de profil fournisseur, listings produits, documents de vérification, coordonnées et données d’usage de base nécessaires au fonctionnement de la marketplace.",
        ],
        [
          "Utilisation des informations",
          "Nous utilisons les informations pour fournir l’accès marketplace, router les RFQ, gérer les listings fournisseurs, soutenir les workflows de vérification, améliorer le produit, prévenir les abus et communiquer les mises à jour du service.",
        ],
        [
          "Authentification",
          "TMP utilise Supabase Auth et peut proposer la connexion Google. Lorsque vous vous authentifiez avec Google, nous recevons les informations nécessaires pour créer ou accéder à votre profil TMP, comme l’adresse e-mail et les détails de base du profil.",
        ],
        [
          "Fournisseurs et acheteurs",
          "Les informations fournisseur et produit publiées peuvent être visibles publiquement. Les RFQ et documents de vérification sont destinés à rester privés et sont protégés par les contrôles d’accès de la base de données.",
        ],
        [
          "Prestataires",
          "Nous utilisons des prestataires tiers comme Supabase, Vercel, Google et de futurs fournisseurs de paiement pour héberger, authentifier, sécuriser, analyser et opérer le service.",
        ],
        [
          "Conservation des données",
          "Nous conservons les informations tant qu’elles sont nécessaires aux opérations marketplace, aux exigences légales, à la sécurité et aux intérêts commerciaux légitimes. Les utilisateurs peuvent demander des mises à jour ou suppressions lorsque cela s’applique.",
        ],
        [
          "Contact",
          "Pour les questions de confidentialité ou les demandes liées aux données, contactez l’équipe TMP via le canal officiel de la marketplace. Une boîte de réception dédiée pourra être ajoutée à mesure que la structure mûrit.",
        ],
      ],
      termsBadge: "Conditions",
      termsTitle: "Conditions d’utilisation",
      termsIntro:
        "Ces conditions définissent les règles de base d’utilisation de TMP pendant la phase MVP et validation de la marketplace.",
      termsMetadataTitle: "Conditions d’utilisation | TMP",
      termsMetadataDescription:
        "Conditions d’utilisation de TMP, marketplace B2B pour acheteurs européens et fournisseurs turcs.",
      termsSections: [
        [
          "Rôle de la marketplace",
          "TMP fournit une marketplace digitale pour la découverte sourcing, la soumission RFQ, les profils fournisseurs et les listings produits. TMP n’est pas automatiquement partie aux transactions acheteur-fournisseur sauf accord écrit séparé.",
        ],
        [
          "Comptes",
          "Les utilisateurs sont responsables de l’exactitude des informations de compte, de l’accès autorisé à leur profil entreprise et de la sécurité des identifiants. Les accès acheteur et fournisseur peuvent varier selon le rôle et le statut de vérification.",
        ],
        [
          "Listings fournisseurs",
          "Les fournisseurs sont responsables de maintenir exacts et conformes leurs listings produits, informations entreprise, certifications, fourchettes de prix, délais et quantités minimales.",
        ],
        [
          "RFQ",
          "Les acheteurs sont responsables de soumettre des besoins sourcing exacts. Les réponses RFQ, prix, échantillons, contrats, logistique, douanes et paiements sont gérés entre acheteur et fournisseur sauf si TMP propose ultérieurement des services managés.",
        ],
        [
          "Vérification",
          "Les fonctions de vérification visent à renforcer la confiance acheteur, mais ne garantissent pas la performance fournisseur, la qualité produit, la conformité réglementaire ou les résultats transactionnels. Les décisions finales restent soumises à la revue TMP.",
        ],
        [
          "Usage acceptable",
          "Les utilisateurs ne peuvent pas soumettre de contenu frauduleux, illégal, contrefaisant, abusif, trompeur ou nuisible, ni tenter de contourner la sécurité marketplace, Row Level Security ou les contrôles d’accès.",
        ],
        [
          "Évolutions",
          "TMP peut mettre à jour ces conditions à mesure que la marketplace évolue. L’utilisation continue du service après mise à jour vaut acceptation des nouvelles conditions.",
        ],
      ],
    },
    notFound: {
      metadataTitle: "Page introuvable | TMP",
      title: "Cette route est encore en cours de sourcing.",
      body: "La page a peut-être été déplacée ou attend le prochain sprint marketplace.",
      cta: "Retour à l’accueil",
    },
    metadata: {
      rootTitle: "TMP | Turkiye Market Place",
      rootDescription:
        "Marketplace B2B premium reliant les acheteurs européens aux fournisseurs turcs vérifiés.",
      loginTitle: "Connexion | TMP",
      loginDescription: "Accédez à votre compte TMP.",
      registerTitle: "Inscription | TMP",
      registerDescription:
        "Créez un compte TMP unique pour le sourcing et la configuration fournisseur.",
    },
  },
} as const;

const turkishDictionary = {
  nav: {
    products: "Ürünler",
    suppliers: "Tedarikçiler",
    rfq: "Teklif Talebi",
    dashboard: "Panel",
    login: "Giriş",
    logout: "Çıkış yap",
    join: "TMP'ye Katıl",
    joinShort: "Katıl",
    backHome: "Ana sayfaya dön",
  },
  contact: {
    contact: "İletişim",
    title: "TMP ekibiyle iletişime geçin",
    body: "Pazar yerine katılmak için yöneticiyle doğrudan iletişime geçin.",
    call: "Yöneticiyi ara",
    email: "Yöneticiye e-posta gönder",
    close: "İletişim bilgilerini kapat",
  },
  common: {
    verified: "Doğrulandı",
    verifiedSupplier: "Doğrulanmış tedarikçi",
    moq: "Minimum sipariş",
    response: "Yanıt",
    requestQuote: "Teklif iste",
    backToSuppliers: "Tedarikçilere dön",
    category: "Kategori",
    categories: "Kategoriler",
    marketplace: "Pazar yeri",
    complete: "Tamamlandı",
    pending: "Beklemede",
    review: "İnceleme",
    export: "İhracat",
    status: "Durum",
    action: "İşlem",
    location: "Konum",
    search: "Ara",
    clearFilters: "Filtreleri temizle",
    all: "Tümü",
    save: "Kaydet",
    cancel: "İptal",
    create: "Oluştur",
    edit: "Düzenle",
    archive: "Arşivle",
    price: "Fiyat",
    leadTime: "Teslim süresi",
    supplier: "Tedarikçi",
    product: "Ürün",
    units: "adet",
    onRequest: "Talep üzerine",
    uncategorized: "Kategorisiz",
    generalSourcing: "Genel sourcing",
    home: "Ana sayfa",
    privacy: "Gizlilik",
    terms: "Şartlar",
    goToProfile: "Profile git",
  },
  footer: {
    intro:
      "TMP, Avrupalı alıcıların ihracata hazır Türk tedarikçileri keşfetmesine, karşılaştırmasına ve teklif istemesine yardımcı olur.",
    suppliers: "Tedarikçiler",
    rfq: "Teklif iste",
    buyerLogin: "Alıcı girişi",
    supplierOnboarding: "Tedarikçi başvurusu",
    privacy: "Gizlilik",
    terms: "Şartlar",
    rights: "© 2026 TMP. Tüm hakları saklıdır.",
    note: "Sourcing doğrulaması, alıcı güveni ve tedarikçi büyümesi için geliştirildi.",
  },
  home: {
    heroImageAlt: "Gece İstanbul silüeti, Boğaz ve Galata Kulesi",
    badge: "Avrupa için doğrulanmış Türk tedarik ağı",
    title: "Turkiye Market Place",
    subtitle:
      "İhracata hazır Türk tedarikçilerden tekstil, makine, gıda, ev ürünleri, yapı malzemeleri ve ambalaj tedarik edin.",
    searchPlaceholder: "Ürün, kategori veya tedarikçi ara",
    headerSearchPlaceholder: "Ürün veya tedarikçi ara",
    allCategories: "Tüm kategoriler",
    startSourcing: "Tedarike başla",
    popularSearches: "Popüler aramalar",
    liveBoard: "Tedarik talebi örnekleri",
    marketplaceWelcome: "TMP'ye hoş geldiniz",
    categoriesForYou: "Sizin için kategoriler",
    frequentlySearched: "Sık aranan",
    recommendedForBusiness: "İşletmeniz için önerilenler",
    businessTools: [
      "Teklif talebi",
      "Doğrulanmış üreticiler",
      "Hızlı özelleştirme",
    ],
    guaranteedTitle: "TMP Güvencesi",
    guaranteedItems: [
      "Yapılandırılmış teklif talepleri",
      "Doğrulanmış tedarikçi sinyalleri",
      "Teklif takip desteği",
    ],
    exploreNow: "Keşfet",
    featuredSuppliers: "Öne çıkan tedarikçiler",
    featuredTitle: "Güven sinyalleri görünür olan ihracata hazır iş ortakları.",
    exploreSuppliers: "Tedarikçileri keşfet",
    featuredCategories: "Öne çıkan kategoriler",
    categoriesTitle:
      "Avrupalı alıcıların Türkiye'den halihazırda tedarik ettiği kategoriler etrafında kuruldu.",
    categoriesBody:
      "Kategori uyumu, kapasite, sertifikalar, ihracat pazarları ve yanıt hızı gibi pratik alıcı sinyalleriyle şekillenen odaklı bir tedarikçi ağını inceleyin.",
    benefitVerificationTitle: "Doğrulama odaklı profiller",
    benefitVerificationBody:
      "Sertifikalar, ihracat pazarları, yanıt hızı ve tedarikçi hazırlığı her teklif talebi yolculuğunda görünür kalır.",
    benefitEuropeTitle: "AB sourcing ekipleri için tasarlandı",
    benefitEuropeBody:
      "Alıcılar kategori, minimum sipariş, private label kapasitesi ve ülke bazlı ihracat deneyimini karşılaştırabilir.",
    benefitGrowthTitle: "Tedarikçi büyüme motoru",
    benefitGrowthBody:
      "Türk üreticiler, alıcı güveni ve dönüşüm için tasarlanmış premium bir dijital vitrin kazanır.",
    verificationBadge: "Tedarikçi doğrulaması",
    verificationTitle: "Tedarikçi güvenilirliğini alıcı güvenine dönüştürün.",
    verificationItems: [
      "İhracat hazırlığı incelemesi",
      "Sertifika gösterimi",
      "Doğrulanmış rozet yerleşimi",
    ],
    trustMetrics: [
      "Ürün kategorileri",
      "Listelenen tedarikçiler",
      "Yayınlanan ürünler",
    ],
    applySupplier: "Tedarikçi olarak başvur",
  },
  suppliers: {
    badge: "Tedarikçi rehberi",
    title:
      "Avrupa sourcing ekipleri için hazırlanmış Türk tedarikçileri arayın.",
    body: "Teklif talebi göndermeden önce doğrulama durumunu, kategorileri, ihracat pazarlarını, minimum siparişleri ve yanıt hızını karşılaştırın.",
    indexed: "tedarikçi listeleniyor",
    indexedSingular: "tedarikçi listeleniyor",
    filters: "Filtreler",
    search: "Ara",
    searchPlaceholder: "Tekstil, CNC, ambalaj",
    allCategories: "Tüm kategoriler",
    verification: "Doğrulama",
    checks: [
      "Doğrulanmış tedarikçiler",
      "AB ihracat deneyimi",
      "Düşük minimum sipariş",
    ],
    viewSupplier: "Tedarikçiyi görüntüle",
    emptyTitle: "Bu filtrelerle eşleşen tedarikçi yok",
    emptyBody:
      "Daha geniş bir arama deneyin, filtreyi temizleyin veya tüm tedarikçi rehberine göz atın.",
  },
  products: {
    badge: "Ürün keşfi",
    title: "Avrupa sourcing için hazır Türk üretimi ürünleri inceleyin.",
    body: "Yayınlanan tedarikçi ilanlarını ürün, kategori, tedarikçi, minimum sipariş, fiyat aralığı ve teslim süresine göre arayın.",
    indexed: "yayınlanmış ürün",
    indexedSingular: "yayınlanmış ürün",
    filters: "Filtreler",
    searchPlaceholder: "Denim ceket, CNC gövde, zeytinyağı...",
    allCategories: "Tüm kategoriler",
    allSuppliers: "Tüm tedarikçiler",
    emptyTitle: "Yayınlanmış ürün bulunamadı",
    emptyBody:
      "Daha geniş bir arama deneyin veya tedarikçiler daha fazla ürün yayınladığında tekrar kontrol edin.",
    verified: "Doğrulanmış tedarikçi",
    quote: "Teklif",
    viewProduct: "Ürünü görüntüle",
    productDetails: "Ürün detayları",
    supplierInfo: "Tedarikçi bilgileri",
    related: "Bu tedarikçiden diğer ürünler",
    requestQuote: "Teklif iste",
    backToProducts: "Ürünlere dön",
    notConfigured: "Supabase ürünleri bu ortamda henüz yapılandırılmadı.",
    metadataTitle: "Ürün Keşfi | TMP",
    metadataDescription:
      "Yayınlanmış Türk tedarikçi ürünlerini arama, kategori, tedarikçi, MOQ, fiyat aralığı ve teslim süresine göre inceleyin.",
    detailFallbackTitle: "Ürün | TMP",
    detailFallbackDescription: "TMP ürün detayı.",
    metadataFromSupplier: "tedarikçisinden",
    metadataMoq: "MOQ",
    seoKeywords: [
      "Türk ürünleri",
      "B2B ürün sourcing",
      "tedarikçi ürünleri",
      "Türkiye ihracat ürünleri",
      "Avrupa sourcing",
    ],
    detailSeoKeywords: [
      "Türk tedarikçi ürünü",
      "B2B RFQ",
      "Türkiye ihracat sourcing",
    ],
  },
  supplierDetail: {
    founded: "Kuruluş",
    team: "Ekip",
    productCatalog: "Ürün kataloğu",
    previewProducts: "Ürün önizlemesi",
    viewAllProducts: "Tedarikçinin tüm ürünlerini görüntüle",
    certifications: "Sertifikalar",
    licenses: "Lisanslar ve denetimler",
    exportMarkets: "İhracat pazarları",
    metadataNotFoundTitle: "Tedarikçi bulunamadı | TMP",
    metadataNotFoundDescription: "Bu tedarikçi profili mevcut değil.",
    metadataVerifiedTitle: "Doğrulanmış Türk Tedarikçi",
    metadataBasedIn: "Konum",
    metadataCategory: "Kategori",
    seoKeywords: [
      "doğrulanmış Türk tedarikçi",
      "Türkiye üreticisi",
      "B2B sourcing",
    ],
  },
  rfq: {
    badge: "Teklif talebi",
    title:
      "Tek bir sourcing brief'i gönderin. Doğru Türk tedarikçilere ulaşın.",
    body: "Tedarikçilerin uygunluğu değerlendirmesi, fiyat hazırlaması ve faydalı bir sonraki adımla yanıt vermesi için gereken detayları paylaşın.",
    bullets: [
      "Ürün özellikleri",
      "Hedef miktar ve varış ülkesi",
      "İsteğe bağlı çizim veya referans dosyaları",
    ],
    requesterName: "Adınız",
    requesterNamePlaceholder: "Aylin Demir",
    requesterEmail: "Tedarikçi yanıtları için e-posta",
    requesterEmailPlaceholder: "siz@sirket.com",
    requesterCompany: "Şirket (isteğe bağlı)",
    requesterCompanyPlaceholder: "Şirket adı",
    signInRequiredTitle: "RFQ göndermeden önce giriş yapın",
    signInRequiredBody:
      "TMP hesabı talebinizi gizli tutar, ek yüklemenizi sağlar ve tedarikçilere doğrulanmış bir yanıt adresi sunar.",
    signInToSubmit: "Göndermek için giriş yap",
    productRequest: "Ürün spesifikasyonu",
    productPlaceholder:
      "Organik pamuk hoodie, 320gsm polar, OEKO-TEX, 500 adet",
    productHelp:
      'Ürün türünü, malzemeyi veya teknik özelliği, sertifika ihtiyacını ve hedef miktarı ekleyin. "Hoodie" veya "kutu" gibi belirsiz talepler yönlendirmeyi zorlaştırır.',
    selectCategory: "Kategori seç",
    quantity: "Miktar",
    quantityPlaceholder: "500 adet",
    destinationCountry: "Varış ülkesi",
    selectCountry: "Ülke seç",
    destinationCountries: [
      "Almanya",
      "Hollanda",
      "Fransa",
      "İspanya",
      "İtalya",
      "Birleşik Krallık",
    ],
    timeline: "Hedef zamanlama",
    timelinePlaceholder: "3 hafta içinde numune",
    notes: "Notlar / mesaj",
    notesPlaceholder:
      "Malzeme, sertifika, ambalaj, Incoterms ve mevcut tedarikçi kıyaslarını paylaşın.",
    upload: "Ek yükle",
    uploadHelp:
      "En fazla 10 MB özel PDF, JPG, PNG veya WebP. Yalnızca TMP inceleyicileri erişebilir.",
    uploadSignIn:
      "Özel teknik çizim, referans görsel veya teknik föy eklemek için giriş yapın.",
    submit: "Teklif talebini gönder",
    status: {
      success:
        "Teklif talebi gönderildi. Sourcing ekibimiz kısa süre içinde inceleyecek.",
      missing: "Lütfen ürün talebi, miktar ve varış ülkesini ekleyin.",
      specific:
        "Lütfen ürün talebini malzeme, teknik özellik, sertifika veya hedef miktarla daha belirgin hale getirin.",
      context:
        "Bu ürün, tedarikçi veya kategori artık kullanılamıyor. Lütfen güncel bir pazar yeri seçeneği belirleyin.",
      config: "Supabase bu ortam için henüz yapılandırılmadı.",
      notification:
        "Teklif talebi kaydedildi, ancak e-posta bildirimi gönderilemedi. Lütfen TMP destek ekibiyle iletişime geçin.",
      attachmentAuth: "Özel ek eklemeden önce giriş yapın.",
      attachment:
        "En fazla 10 MB boyutunda geçerli bir PDF, JPG, PNG veya WebP kullanın.",
      error: "Teklif talebi gönderilemedi. Lütfen tekrar deneyin.",
    },
    metadataTitle: "RFQ Gönder | TMP",
    metadataDescription:
      "Ürün, miktar, varış ülkesi ve ek detaylarıyla Türk tedarikçilere yapılandırılmış sourcing talebi gönderin.",
  },
  auth: {
    welcomeBack: "Tekrar hoş geldiniz",
    loginTitle: "TMP hesabınızla devam edin.",
    loginBody:
      "Tek hesapla alıcı olarak tedarik yapabilir, RFQ'ları yönetebilir ve hazır olduğunuzda tedarikçi profili ekleyebilirsiniz.",
    supplierLoginTitle: "Tedarikçi yükseltmesini başlatmak için giriş yapın.",
    supplierLoginBody:
      "Şirket bilgilerini eklemek ve tedarikçi araçlarını açmak için mevcut TMP hesabınızı kullanın. Ücretli doğrulama isteğe bağlıdır.",
    buyerLogin: "Alıcı girişi",
    supplierLogin: "Tedarikçi girişi",
    email: "E-posta",
    password: "Şifre",
    forgotPassword: "Şifrenizi mi unuttunuz?",
    forgotPasswordTitle: "Şifrenizi sıfırlayın",
    forgotPasswordBody:
      "Hesap e-postanızı girin. Bir hesap varsa TMP güvenli bir sıfırlama bağlantısı gönderir.",
    sendResetLink: "Sıfırlama bağlantısı gönder",
    backToLogin: "Girişe dön",
    resetPasswordTitle: "Yeni bir şifre seçin",
    resetPasswordBody:
      "En az 8 karakter kullanın. Sıfırlama bağlantınız hâlâ geçerli olmalıdır.",
    newPassword: "Yeni şifre",
    confirmPassword: "Yeni şifreyi doğrulayın",
    updatePassword: "Şifreyi güncelle",
    login: "Giriş",
    supplierLoginCta: "Tedarikçi yükseltmesine devam et",
    newToTmp: "TMP'de yeni misiniz?",
    createAccount: "Hesap oluştur",
    supplierCreateAccount: "Hesap oluştur ve devam et",
    onboarding: "TMP onboarding",
    registerTitle:
      "Tek TMP hesabı oluşturun. Hazır olduğunuzda tedarikçi erişimi ekleyin.",
    supplierRegisterTitle: "Satışa başlamak için TMP hesabınızı oluşturun.",
    supplierRegisterBody:
      "Sonraki adımda tedarikçi profilinizi ekleyip aynı hesaptan ürün yayınlayabilirsiniz. Ücretli doğrulama ayrıca eklenebilir.",
    accountPath: "Tek TMP hesabı",
    accountPathBody:
      "Tedarikçileri inceleyin, teklif talepleri gönderin ve sourcing sürecini tek girişle yönetin.",
    supplierUpgradePath: "Tedarikçi profili yükseltmesi",
    supplierUpgradePathBody:
      "Hesap oluşturduktan sonra şirket bilgilerini ekleyip ürün yayınlayın. Doğrulama isteğe bağlı ücretli bir yükseltmedir.",
    supplierStepAccount: "1. Oluştur veya giriş yap",
    supplierStepAccountBody:
      "Satın alma, sourcing ve tedarikçi araçları için tek TMP girişini kullanın.",
    supplierStepUpgrade: "2. Tedarikçi yükseltmesi ekle",
    supplierStepUpgradeBody:
      "Şirket bilgilerini ekleyip ürün yayınlayın. Rozet istediğinizde ücretli doğrulama ekleyin.",
    buyerPath: "Alıcı yolu",
    buyerPathBody:
      "Teklif talepleri gönderin ve tedarikçileri kısa listeye alın.",
    supplierPath: "Tedarikçi yolu",
    supplierPathBody:
      "Tedarikçi profili ekleyip ürün yayınlayın. Doğrulama isteğe bağlıdır.",
    accountTitle: "TMP hesabı",
    accountBody:
      "Alıcı sourcing varsayılan olarak dahildir. Tedarikçi erişimi aynı hesaba eklenebilir.",
    supplierAccountTitle: "Adım 1: TMP hesabı",
    supplierAccountBody:
      "Sourcing ve tedarikçi araçları için kullanacağınız aynı hesaba giriş yapın veya hesap oluşturun.",
    supplierIntentTitle: "Adım 2: Tedarikçi yükseltmesi",
    supplierIntentBody:
      "Girişten sonra şirket bilgilerini ekleyip yayınlamaya başlayın. Ücretli doğrulama isteğe bağlıdır.",
    buyerAccount: "Alıcı hesabı",
    supplierAccount: "Tedarikçi profili",
    fullName: "Ad soyad",
    company: "Şirket",
    workEmail: "İş e-postası",
    primaryRole: "Ana rol",
    selectRole: "Rol seç",
    buyer: "Alıcı",
    supplier: "Tedarikçi",
    continueWithGoogle: "Google ile devam et",
    supplierContinueWithGoogle: "Google ile devam et",
    googleHelp:
      "Tek TMP hesabıyla devam etmek için Google kullanın. Tedarikçi kurulumu girişten sonra yapılır.",
    supplierGoogleHelp:
      "Tek TMP hesabıyla devam edin. Tedarikçi profili sonraki adımda kurulur; ücretli doğrulama isteğe bağlıdır.",
    orEmail: "veya e-posta ile devam et",
    alreadyAccount: "Zaten hesabınız var mı?",
    status: {
      missing: "Lütfen zorunlu alanları tamamlayın.",
      error: "Kimlik doğrulama başarısız oldu. Lütfen tekrar deneyin.",
      checkEmail:
        "Giriş yapmadan önce hesabı onaylamak için e-postanızı kontrol edin.",
      authRequired: "Hesabınıza devam etmek için giriş yapın.",
      oauthNotReady:
        "Google girişi başlatılamadı. Lütfen tekrar deneyin veya e-posta ile devam edin.",
      passwordUpdated: "Şifre güncellendi. Şimdi giriş yapabilirsiniz.",
      resetSent:
        "Bu e-postayla bir hesap varsa güvenli sıfırlama bağlantısı gönderilecektir.",
      invalidEmail: "Geçerli bir e-posta adresi girin.",
      resetError:
        "Sıfırlama bağlantısı tamamlanamadı. Yeni bir bağlantı isteyin.",
      resetExpired:
        "Bu sıfırlama oturumunun süresi doldu. Yeni bir bağlantı isteyin.",
      passwordMismatch:
        "8 ile 128 karakter arasında eşleşen şifreler kullanın.",
    },
  },
  dashboard: {
    eyebrow: "Tedarikçi çalışma alanı",
    title: "Panel",
    description:
      "Tedarikçi görünürlüğünü, gelen RFQ'ları, ürün taleplerini ve doğrulama hazırlığını takip edin.",
    previewData: "Önizleme hattı",
    previewBody:
      "Canlı RFQ'lar ve tedarikçi analitiği bağlanana kadar panel sayıları ve satırları örnek veridir.",
    overview: "Genel bakış",
    products: "Ürünler",
    profile: "Profil",
    listings: "İlanlar",
    rfqs: "RFQ'lar",
    productInquiries: "Ürün talepleri",
    verification: "Doğrulama",
    verificationSettings: "Doğrulama ayarları",
    metrics: ["Aktif ilanlar", "Açık RFQ'lar", "Ürün talepleri", "Doğrulama"],
    supplierRequestRows: [
      ["Organik pamuk basics", "Almanya", "500 adet", "Yeni"],
      ["Sert kozmetik kutuları", "Fransa", "2.000 adet", "İnceleme"],
      ["CNC alüminyum gövde", "İtalya", "100 adet", "Tekliflendi"],
    ],
    readinessRows: [
      ["Şirket belgeleri", "Tamamlandı"],
      ["Sertifikalar", "İnceleme gerekli"],
      ["Fabrika fotoğrafları", "Tamamlandı"],
      ["İhracat referansları", "Beklemede"],
    ],
    recentRequests: "Son alıcı talepleri",
    profileReadiness: "Profil hazırlığı",
    buyerActivity: "Alıcı aktivitesi",
    nextActions: "Sonraki adımlar",
    manageProducts: "Ürünleri yönet",
    reviewProducts: "İlanları incele",
    listingsBody:
      "Yayınlanan ürünleri minimum sipariş, fiyat aralığı, teslim süresi ve kategori detaylarıyla güncel tutun.",
    productInquiriesBody:
      "Tedarikçi RFQ yönlendirmesi etkinleştiğinde ürün talepleri geldikleri ilanların yanında görünür.",
    nextActionsBody:
      "Alıcı trafiği artmadan önce doğrulama ve ürün kalite sinyallerini hazırlayın.",
    upgradeTitle: "Doğrulanmış tedarikçiye yükselt",
    upgradeBody:
      "Aylık doğrulama aboneliğini başlatın ve belgeleri yönetici incelemesine gönderin.",
    upgradeCta: "Doğrulama ayarlarını aç",
    buyerWorkspace: {
      eyebrow: "Alıcı çalışma alanı",
      description:
        "RFQ'ları, kaydedilen tedarikçileri, ürün kısa listelerini ve ürün taleplerini takip edin.",
      metrics: [
        "Açık RFQ'lar",
        "Kaydedilen tedarikçiler",
        "Ürün talepleri",
        "Kısa listedeki ürünler",
      ],
      activeRequests: "Aktif sourcing talepleri",
      createRfq: "RFQ oluştur",
      requestRows: [
        ["Organik pamuk basics", "Tedarikçiler eşleştiriliyor", "3 yanıt"],
        ["Sert kozmetik kutuları", "Teklifler inceleniyor", "2 yanıt"],
        ["CNC alüminyum gövde", "Taslak talep", "Gönderilmedi"],
      ],
      discovery: "Tedarikçi keşfi",
      continueSourcing: "Sourcing'e devam et",
      discoveryBody:
        "Doğrulanmış Türk tedarikçileri inceleyin, ürün ilanlarını karşılaştırın ve hazır olduğunuzda yapılandırılmış RFQ gönderin.",
      browseProducts: "Ürünlere göz at",
      exploreSuppliers: "Tedarikçileri keşfet",
      savedSuppliers: "Kaydedilen tedarikçiler",
      productInquiries: "Ürün talepleri",
      savedSuppliersBody:
        "Güvenilir tedarikçileri kategori, konum, minimum sipariş ve yanıt hızına göre karşılaştırın.",
      productInquiriesBody:
        "Yayınlanan ürünleri inceleyin ve tam ihtiyaç duyduğunuz üründen teklif talebi başlatın.",
      nextActionsBody:
        "Miktar, varış ülkesi, zamanlama ve sourcing notlarıyla yapılandırılmış RFQ oluşturun.",
    },
    productManager: {
      eyebrow: "Tedarikçi ürünleri",
      title: "Ürünler",
      description:
        "Alıcıların TMP'de keşfettiği ürün ilanlarını oluşturun, yayınlayın ve yönetin.",
      createProduct: "Ürün oluştur",
      editProduct: "Ürünü düzenle",
      noProducts: "Henüz tedarikçi ürünü yok",
      noProductsBody:
        "Yayınlandığında pazar yerinde görünmesi için ilk ürün ilanını oluşturun.",
      loginRequired: "Giriş gerekli",
      loginRequiredBody:
        "Ürün ilanlarını yönetmeden önce TMP hesabınıza giriş yapın ve tedarikçi profili ekleyin.",
      supplierMissing: "Tedarikçi profili gerekli",
      supplierMissingBody:
        "TMP hesabınızda tedarikçi araçları henüz etkin değil. Ürün yayınlamayı açmak için Profil'den yükseltin.",
      productTitle: "Ürün başlığı",
      category: "Kategori",
      productDescription: "Açıklama",
      minimumOrderQuantity: "Minimum sipariş miktarı",
      priceMin: "Minimum fiyat",
      priceMax: "Maksimum fiyat",
      currency: "Para birimi",
      leadTime: "Teslim süresi",
      images: "Görseller",
      leadTimePlaceholder: "2-4 hafta",
      imageHelp:
        "En fazla 5 MB boyutunda JPG, PNG veya WebP görsel yükleyin. TMP görseli tedarikçi hesabınızla güvenli biçimde saklar.",
      replaceImage:
        "Mevcut görseli değiştirmek istediğinizde yeni bir JPG, PNG veya WebP dosyası seçin.",
      imageError:
        "En fazla 5 MB boyutunda geçerli bir JPG, PNG veya WebP görsel ekleyin.",
      status: "Durum",
      draft: "Taslak",
      published: "Yayında",
      archived: "Arşivlendi",
      saveDraft: "Ürünü kaydet",
      updateProduct: "Ürünü güncelle",
      tableProduct: "Ürün",
      tableCategory: "Kategori",
      tablePricing: "Fiyatlandırma",
      tableUpdated: "Oluşturulma",
      supplierAccessRequired: "Tedarikçi erişimi gerekli",
      supplierAccessCreateBody:
        "Tedarikçi ürün ilanları oluşturmadan önce tedarikçi profili ekleyin. Aynı hesaptan ürünleri incelemeye veya sourcing talebi göndermeye devam edebilirsiniz.",
      supplierAccessEditBody:
        "Tedarikçi ürün ilanlarını düzenlemeden önce tedarikçi profili ekleyin.",
      supplierAccessBody:
        "Ürün yayınlama, tedarikçi profili eklendikten sonra kullanılabilir. TMP hesabınız yine ürünleri inceleyebilir, tedarikçileri kaydedebilir ve RFQ gönderebilir.",
      browseProducts: "Ürünlere göz at",
      successCreate: "Ürün oluşturuldu.",
      successUpdate: "Ürün güncellendi.",
      successArchive: "Ürün arşivlendi.",
      missing: "Lütfen başlık, kategori, açıklama ve durum ekleyin.",
      error: "Ürün kaydedilemedi. Lütfen tekrar deneyin.",
    },
    metadataTitle: "Panel | TMP",
    metadataDescription:
      "RFQ'lar, ürün keşfi ve tedarikçi araçları için TMP çalışma alanı.",
    productMetadataTitle: "Tedarikçi Ürünleri | TMP",
    productMetadataDescription:
      "TMP tedarikçi ürün ilanlarını oluşturun ve yönetin.",
    createProductMetadataTitle: "Ürün Oluştur | TMP",
    createProductMetadataDescription: "TMP'de tedarikçi ürün ilanı oluşturun.",
    editProductMetadataTitle: "Ürünü Düzenle | TMP",
    editProductMetadataDescription: "TMP tedarikçi ürün ilanını düzenleyin.",
  },
  profileSettings: {
    eyebrow: "Hesap profili",
    title: "Profil",
    description:
      "TMP hesabınızı, tedarikçi yükseltmesini ve doğrulanmış rozet üyeliğini yönetin.",
    accountTitle: "Hesap",
    email: "E-posta",
    accountType: "Hesap türü",
    buyerAccount: "Alıcı hesabı",
    supplierAccount: "Tedarikçi hesabı",
    supplierEnabled: "Tedarikçi araçları etkin",
    supplierUpgradeTitle: "Tedarikçiye yükselt",
    supplierUpgradeBody:
      "Tedarikçi araçlarını açmak için temel işletme bilgilerini ekleyin. Bu işlem ücret almaz ve doğrulanmış rozet eklemez.",
    businessName: "İşletme adı",
    startSupplierUpgrade: "Tedarikçiye yükselt",
    supplierReadyTitle: "Tedarikçi profili",
    supplierReadyBody:
      "Hesabınızda tedarikçi araçları etkin. Ürün ilanlarını yönetebilir ve doğrulama için ödeme yapıp yapmamayı seçebilirsiniz.",
    verifiedTitle: "Doğrulanmış rozet üyeliği",
    verifiedBody:
      "Doğrulanmış rozet ücretli aylık üyelikle verilir. Rozet ve doğrulama incelemesi istediğinizde aboneliği başlatın veya yönetin.",
    verifiedLockedBody:
      "Önce işletme adınızı ekleyerek tedarikçiye yükseltin. Ardından doğrulanmış rozet için ücretli üyeliği başlatabilirsiniz.",
    verificationSettings: "Doğrulama ayarları",
    manageProducts: "Ürünleri yönet",
    businessNamePlaceholder: "Anatolia Distribution",
    metadataTitle: "Profil | TMP",
    metadataDescription:
      "TMP profilinizi, tedarikçi yükseltmesini ve doğrulamayı yönetin.",
  },
  verificationSettings: {
    eyebrow: "Tedarikçi doğrulaması",
    title: "Doğrulama ayarları",
    description:
      "Aylık doğrulama aboneliğini yönetin, işletme belgelerini gönderin ve tedarikçi profilinizi yönetici onayına hazırlayın.",
    overview: "Doğrulama özeti",
    currentStatus: "Doğrulama durumu",
    subscriptionStatus: "Abonelik durumu",
    benefits: "Doğrulama avantajları",
    benefitItems: [
      "Tedarikçi ve ürün kartlarında doğrulanmış rozet",
      "RFQ incelemesi sırasında daha yüksek alıcı güveni",
      "Pazar yeri keşfinde daha iyi görünürlük",
      "Gelecekteki premium tedarikçi özelliklerine erişim",
    ],
    subscription: "Aylık abonelik",
    price: "€1 / ay",
    priceNote:
      "Distribütör onboarding'i ve Stripe testi için tanıtım amaçlı aylık doğrulama aboneliği.",
    subscribe: "Aboneliği başlat",
    manage: "Aboneliği yönet",
    documents: "İşletme doğrulaması",
    documentsBody:
      "Yönetici incelemesi için özel işletme belgelerini yükleyin. Dosyalar güvenli biçimde saklanır ve pazar yerinde herkese açık değildir.",
    supplierAccessTitle: "Tedarikçi profili ekle",
    supplierAccessBody:
      "TMP hesabınız varsayılan olarak alıcı sourcing yapabilir. Tedarikçi araçlarını açmak için şirket bilgilerini ekleyin; ücretli doğrulama isteğe bağlıdır.",
    supplierCompany: "Tedarikçi şirketi",
    startSupplierProfile: "Tedarikçi yükseltmesini başlat",
    businessLicense: "İşletme lisansı",
    companyRegistration: "Şirket kaydı",
    certifications: "Sertifikalar",
    documentRequired: "Zorunlu. En fazla 10 MB PDF, JPG, PNG veya WebP.",
    documentOptional: "İsteğe bağlı. En fazla 10 MB PDF, JPG, PNG veya WebP.",
    documentUploaded:
      "Güvenli biçimde yüklendi. Yalnızca değiştirmek için yeni dosya seçin.",
    notes: "İnceleme notları",
    submitDocuments: "İncelemeye gönder",
    statusSubmitted: "Doğrulama belgeleri yönetici incelemesine gönderildi.",
    statusSupplierStarted:
      "Tedarikçi profili başlatıldı. Ürünleri hemen yayınlayabilir, ücretli doğrulamayı daha sonra ekleyebilirsiniz.",
    statusMissingCompany: "Lütfen tedarikçi şirket adını ekleyin.",
    statusDocumentError:
      "Geçerli işletme lisansı ve şirket kayıt dosyaları ekleyin. En fazla 10 MB PDF, JPG, PNG veya WebP kullanın.",
    statusError: "Doğrulama detayları güncellenemedi. Lütfen tekrar deneyin.",
    checkoutPlaceholder:
      "Checkout yer tutucusu açıldı. Kimlik bilgileri eklendiğinde Stripe bağlanmaya hazır.",
    checkoutSuccess:
      "Checkout tamamlandı. Stripe aboneliği webhook ile onaylayacak.",
    checkoutCancelled: "Checkout iptal edildi. Abonelik başlatılmadı.",
    checkoutError:
      "Stripe checkout oluşturulamadı. Abonelik ortam değişkenlerini kontrol edin.",
    billingActionError:
      "Stripe faturalandırma açılamadı. Lütfen birazdan tekrar deneyin.",
    portalPlaceholder:
      "Müşteri portalı yer tutucusu açıldı. Canlı portal oturumları Stripe yapılandırıldıktan sonra çalışır.",
    portalMissingCustomer:
      "Müşteri portalını açmadan önce doğrulama aboneliği başlatın.",
    portalError: "Stripe müşteri portalı açılamadı. Lütfen tekrar deneyin.",
    preparing: "Hazırlanıyor...",
    opening: "Açılıyor...",
    missingSupplier:
      "Doğrulamadan önce tedarikçi profili oluşturun veya bağlayın.",
    loginRequired: "Tedarikçi profili eklemek veya yönetmek için giriş yapın.",
    states: {
      none: "Başlamadı",
      pending: "İncelemede",
      verified: "Doğrulandı",
      rejected: "Reddedildi",
      inactive: "Pasif",
      active: "Aktif",
      past_due: "Gecikmiş",
      canceled: "İptal edildi",
    },
    metadataTitle: "Doğrulama Ayarları | TMP",
    metadataDescription:
      "TMP tedarikçi doğrulamasını ve faturalandırma ayarlarını yönetin.",
  },
  admin: {
    eyebrow: "Yönetici konsolu",
    title: "Tedarikçi onayları",
    description:
      "Tedarikçi başvurularını, doğrulama durumunu, belgeleri ve pazar yeri hazırlığını inceleyin.",
    pendingApprovals: "Bekleyen onaylar",
    verifiedSuppliers: "Doğrulanmış tedarikçiler",
    queuedChecks: "Sıradaki kontroller",
    approvalTable: "Onay tablosu",
    queue: "Tedarikçi doğrulama kuyruğu",
    supplier: "Tedarikçi",
    risk: "Risk",
    documentChecks: "Belge kontrolleri",
    controls: "Pazar yeri kontrolleri",
    notes: "Onay notları",
    notesBody:
      "İnceleyici notlarını onay kararları, doğrulama kanıtları, kategori kalitesi ve tedarikçi hazırlık sinyallerinin yanında tutun.",
  },
  legal: {
    lastUpdated: "Son güncelleme: 16 Mayıs 2026.",
    privacyBadge: "Gizlilik",
    privacyTitle: "Gizlilik Politikası",
    privacyIntro:
      "Bu politika, TMP'nin güvenilir bir B2B sourcing pazar yeri oluştururken bilgileri nasıl işlediğini açıklar.",
    privacyMetadataTitle: "Gizlilik Politikası | TMP",
    privacyMetadataDescription:
      "Avrupalı alıcıları Türk tedarikçilerle buluşturan B2B sourcing pazar yeri TMP için gizlilik politikası.",
    privacySections: [
      [
        "Topladığımız bilgiler",
        "TMP, pazar yerini işletmek için gerekli hesap bilgileri, şirket bilgileri, RFQ gönderimleri, tedarikçi profil içeriği, ürün ilanları, doğrulama materyalleri, iletişim bilgileri ve temel kullanım verilerini toplayabilir.",
      ],
      [
        "Bilgileri nasıl kullanırız",
        "Bilgileri pazar yeri erişimi sağlamak, RFQ'ları yönlendirmek, tedarikçi ilanlarını yönetmek, doğrulama iş akışlarını desteklemek, ürünü geliştirmek, kötüye kullanımı önlemek ve hizmet güncellemelerini iletmek için kullanırız.",
      ],
      [
        "Kimlik doğrulama",
        "TMP, Supabase Auth kullanır ve Google ile giriş sunabilir. Google ile doğrulama yaptığınızda, e-posta adresi ve temel profil detayları gibi TMP profilinizi oluşturmak veya profilinize erişmek için gereken hesap bilgilerini alırız.",
      ],
      [
        "Tedarikçiler ve alıcılar",
        "Yayınlanan tedarikçi ve ürün bilgileri herkese açık görünebilir. RFQ'lar ve doğrulama belgeleri özel kalmak üzere tasarlanmıştır ve veritabanı erişim kontrolleriyle korunur.",
      ],
      [
        "Hizmet sağlayıcılar",
        "Hizmeti barındırmak, kimlik doğrulamak, güvenceye almak, analiz etmek ve işletmek için Supabase, Vercel, Google ve gelecekteki ödeme sağlayıcıları gibi üçüncü taraf sağlayıcılar kullanırız.",
      ],
      [
        "Veri saklama",
        "Bilgileri pazar yeri operasyonları, yasal gereklilikler, güvenlik ve meşru ticari amaçlar için gerektiği sürece saklarız. Kullanıcılar uygun durumlarda güncelleme veya silme talep edebilir.",
      ],
      [
        "İletişim",
        "Gizlilik soruları veya veri talepleri için resmi pazar yeri iletişim kanalı üzerinden TMP ekibiyle iletişime geçin. Şirket yapısı olgunlaştıkça özel bir gizlilik gelen kutusu eklenebilir.",
      ],
    ],
    termsBadge: "Şartlar",
    termsTitle: "Hizmet Şartları",
    termsIntro:
      "Bu şartlar, pazar yeri MVP ve doğrulama aşamasında TMP kullanımının temel kurallarını açıklar.",
    termsMetadataTitle: "Hizmet Şartları | TMP",
    termsMetadataDescription:
      "Avrupalı alıcılar ve Türk tedarikçiler için B2B sourcing pazar yeri TMP'nin hizmet şartları.",
    termsSections: [
      [
        "Pazar yerinin rolü",
        "TMP, sourcing keşfi, RFQ gönderimi, tedarikçi profilleri ve ürün ilanları için dijital bir pazar yeri sağlar. Ayrı bir yazılı anlaşma olmadıkça TMP, alıcı-tedarikçi işlemlerinin otomatik tarafı değildir.",
      ],
      [
        "Hesaplar",
        "Kullanıcılar doğru hesap bilgilerinden, şirket profiline yetkili erişimden ve giriş bilgilerinin güvenli tutulmasından sorumludur. Alıcı ve tedarikçi erişimi rol ve doğrulama durumuna göre farklılık gösterebilir.",
      ],
      [
        "Tedarikçi ilanları",
        "Tedarikçiler ürün ilanlarını, şirket bilgilerini, sertifikaları, fiyat aralıklarını, teslim sürelerini ve minimum sipariş miktarlarını doğru ve yasal tutmaktan sorumludur.",
      ],
      [
        "RFQ'lar",
        "Alıcılar doğru sourcing gereksinimleri göndermekten sorumludur. RFQ yanıtları, fiyatlandırma, numuneler, sözleşmeler, lojistik, gümrük ve ödemeler, TMP ileride yönetilen hizmetler sunmadıkça alıcı ve tedarikçi arasında yürütülür.",
      ],
      [
        "Doğrulama",
        "Doğrulama özellikleri alıcı güvenini artırmak için tasarlanmıştır; ancak tedarikçi performansını, ürün kalitesini, mevzuat uyumunu veya işlem sonuçlarını garanti etmez. Nihai doğrulama kararları TMP incelemesine tabidir.",
      ],
      [
        "Kabul edilebilir kullanım",
        "Kullanıcılar hileli, yasa dışı, hak ihlal eden, kötüye kullanım içeren, yanıltıcı veya zararlı içerik gönderemez; pazar yeri güvenliğini, Row Level Security'yi veya erişim kontrollerini aşmaya çalışamaz.",
      ],
      [
        "Değişiklikler",
        "TMP, pazar yeri geliştikçe bu şartları güncelleyebilir. Güncellemelerden sonra hizmetin kullanılmaya devam edilmesi, güncellenmiş şartların kabul edildiği anlamına gelir.",
      ],
    ],
  },
  notFound: {
    metadataTitle: "Sayfa Bulunamadı | TMP",
    title: "Bu rota hâlâ tedarik ediliyor.",
    body: "Sayfa taşınmış olabilir veya bir sonraki pazar yeri sprintini bekliyor olabilir.",
    cta: "Ana sayfaya dön",
  },
  metadata: {
    rootTitle: "TMP | Turkiye Market Place",
    rootDescription:
      "Avrupalı alıcıları doğrulanmış Türk tedarikçilerle buluşturan premium B2B sourcing pazar yeri.",
    loginTitle: "Giriş | TMP",
    loginDescription: "TMP hesabınıza erişin.",
    registerTitle: "Kayıt | TMP",
    registerDescription:
      "Sourcing ve tedarikçi kurulumu için tek TMP hesabı oluşturun.",
  },
};

export function getDictionary(locale: Locale) {
  if (locale === "fr") {
    return dictionaries.fr;
  }

  if (locale === "tr") {
    return turkishDictionary;
  }

  return dictionaries.en;
}
