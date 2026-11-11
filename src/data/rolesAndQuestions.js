export const AVAILABLE_ROLES = [
  {
    id: "android_dev",
    title: "Android Developer",
    department: "Mobile Core",
    icon: "Smartphone",
    description: "Develop high-scale native Android apps utilizing Jetpack Compose, Kotlin Coroutines, Room DB, clean architecture, and performance profiling.",
    keyCompetencies: [
      "Jetpack Compose & Declarative UI",
      "Kotlin Coroutines & Flow",
      "Offline Architecture & Room DB",
      "Android Performance & Memory Leaks",
      "App Architecture & Modularization"
    ],
    sampleJobDescription: "We are seeking a Senior Android Engineer to scale our core consumer mobile applications. You will architect robust offline-first experiences using Jetpack Compose, Kotlin Coroutines, and Room Database. You will optimize rendering performance, prevent memory leaks using Profiler and LeakCanary, and design scalable multi-module architectures."
  },
  {
    id: "backend_dev",
    title: "Cloud Backend Engineer",
    department: "Platform Infrastructure",
    icon: "Server",
    description: "Build distributed microservices, low-latency APIs, distributed caching, database indexing, and fault-tolerant cloud pipelines.",
    keyCompetencies: [
      "Distributed Systems & Concurrency",
      "RESTful APIs & gRPC Architecture",
      "Database Indexing & Query Tuning",
      "Distributed Caching (Redis/Memcached)",
      "System Resilience & Circuit Breakers"
    ],
    sampleJobDescription: "Seeking a Cloud Backend Engineer to build fault-tolerant microservices handling millions of requests per day. Core responsibilities include designing gRPC and RESTful services, implementing Redis distributed caching strategies, optimizing PostgreSQL database queries and B-Tree indexes, and enforcing Circuit Breaker resilience patterns."
  },
  {
    id: "java_dev",
    title: "Java Developer",
    department: "Enterprise Systems",
    icon: "Coffee",
    description: "Build enterprise services using Spring Boot, JPA/Hibernate, multithreading, REST APIs, and relational databases.",
    keyCompetencies: [
      "Spring Boot & Microservices",
      "Java Multithreading & Memory Model",
      "Hibernate & Database Transactions",
      "RESTful API & Service Design",
      "Unit Testing & Clean Code"
    ],
    sampleJobDescription: "Looking for an Enterprise Java Developer to develop mission-critical microservices with Spring Boot. Must possess deep knowledge of Java Memory Model, thread synchronization, JPA/Hibernate transaction isolation levels, and automated integration testing."
  },
  {
    id: "python_dev",
    title: "Python Developer",
    department: "Backend & Automation",
    icon: "Terminal",
    description: "Develop scalable backend services, asynchronous APIs, data ingestion scripts, and cloud microservices in Python.",
    keyCompetencies: [
      "Python Asynchronous Programming (asyncio)",
      "FastAPI / Django REST Framework",
      "Database Query Optimization & ORM",
      "API Security & Authentication",
      "Data Structures & Algorithmic Efficiency"
    ],
    sampleJobDescription: "Looking for an experienced Python Backend Engineer to build high-throughput async services using FastAPI and asyncio. You will handle database connection pooling with SQLAlchemy, implement JWT/OAuth2 authentication, and optimize memory consumption across data pipelines."
  },
  {
    id: "web_dev",
    title: "Web Developer",
    department: "Frontend & Web Engineering",
    icon: "Globe",
    description: "Construct responsive, performant web applications with modern TypeScript, React / Next.js, state management, and web accessibility.",
    keyCompetencies: [
      "TypeScript & Modern JavaScript",
      "React State Management & Component Lifecycle",
      "Web Performance & Core Web Vitals",
      "REST & GraphQL Integration",
      "Responsive Design & Accessibility (a11y)"
    ],
    sampleJobDescription: "We need a Senior Web Engineer skilled in React 18+, TypeScript, and Tailwind CSS. You will drive Core Web Vitals optimization (LCP, INP, CLS), architect complex global state workflows, and ensure WCAG 2.1 AA accessibility standards across customer portals."
  },
  {
    id: "data_analyst",
    title: "Data Analyst",
    department: "Business Intelligence & Analytics",
    icon: "BarChart3",
    description: "Analyze complex datasets, generate actionable business intelligence, write high-performance SQL queries, and build analytical dashboards.",
    keyCompetencies: [
      "Advanced SQL & Window Functions",
      "Data Modeling & Warehousing",
      "Statistical Analysis & Hypothesis Testing",
      "Business Intelligence & Dashboarding",
      "Data Cleaning & ETL Pipelines"
    ],
    sampleJobDescription: "Join as a Data Analyst driving operational business intelligence. Required skills include advanced analytical SQL (Window functions, CTEs), Kimball star/snowflake dimensional warehousing, A/B test hypothesis formulation, and executive dashboard design."
  },
  {
    id: "ml_engineer",
    title: "Machine Learning Engineer",
    department: "AI Systems & Intelligence",
    icon: "Cpu",
    description: "Train, optimize, and deploy machine learning models, on-device inference, feature stores, and evaluate model latency and drift.",
    keyCompetencies: [
      "Deep Learning Frameworks (PyTorch/TF)",
      "Model Optimization & Quantization",
      "Data Pipelines & Feature Engineering",
      "LLM Inference & Prompt Optimization",
      "Evaluation Metrics & Drift Detection"
    ],
    sampleJobDescription: "Seeking an ML Engineer to deploy and monitor machine learning models in production. Responsibilities include model quantization (ONNX, TensorRT), feature store pipelines, prompt engineering with Gemini and open-source LLMs, and real-time concept drift monitoring."
  },
  {
    id: "product_mgr",
    title: "Technical Product Manager",
    department: "Product Strategy",
    icon: "Briefcase",
    description: "Lead product discovery, metrics definition, engineering trade-offs, roadmap execution, and user journey optimization.",
    keyCompetencies: [
      "Product Strategy & Vision",
      "Technical Feasibility & Trade-offs",
      "Data Analysis & Metric Design",
      "Stakeholder Alignment & Agile Leadership",
      "User Experience & Empathy"
    ],
    sampleJobDescription: "Technical Product Manager to bridge engineering and business stakeholders. Responsible for defining measurable product roadmaps, evaluating architectural trade-offs, instrumenting funnel telemetry, and driving agile user journey delivery."
  }
];

export const QUESTION_CATALOG = {
  "Android Developer": [
    {
      id: "and_1",
      questionText: "How do you structure unidirectional data flow in Jetpack Compose, and what mechanisms prevent unnecessary recompositions when state updates?",
      targetCompetency: "Jetpack Compose & Declarative UI",
      difficulty: "INTERMEDIATE",
      keywordsExpected: ["state", "hoist", "hoisting", "mutableStateFlow", "remember", "recomposition", "collectAsState", "immutable", "unidirectional"],
      rationaleTemplate: "Evaluates foundational architecture and reactive UI composition."
    },
    {
      id: "and_2",
      questionText: "Compare CoroutineScope, supervisorScope, and CoroutineExceptionHandler. What happens when a child coroutine encounters an unhandled exception?",
      targetCompetency: "Kotlin Coroutines & Flow",
      difficulty: "ADVANCED",
      keywordsExpected: ["supervisorscope", "coroutinescope", "cancel", "failure", "child", "handler", "structured concurrency"],
      rationaleTemplate: "Advanced validation of asynchronous concurrency and error propagation."
    },
    {
      id: "and_3",
      questionText: "How would you design an offline-first mobile sync engine with Room, handling conflict resolution, optimistic UI updates, and unstable connectivity?",
      targetCompetency: "Offline Architecture & Room DB",
      difficulty: "ADVANCED",
      keywordsExpected: ["room", "single source of truth", "flow", "workmanager", "sync", "conflict", "optimistic", "transactions"],
      rationaleTemplate: "Assesses system resilience and local data persistence under real-world constraints."
    },
    {
      id: "and_4",
      questionText: "Walk me through how you detect, isolate, and fix severe memory leaks and frame drops in a production Android app with heavy image and list scrolling.",
      targetCompetency: "Android Performance & Memory Leaks",
      difficulty: "EXPERT",
      keywordsExpected: ["leakcanary", "profiler", "systrace", "perfetto", "heap", "gc", "jank", "baseline profiles", "bitmap"],
      rationaleTemplate: "Probing high-level diagnostic skills and production profiling expertise."
    },
    {
      id: "and_5",
      questionText: "In a multi-module Android project, how do you manage dependency injection and feature navigation without creating tight circular coupling?",
      targetCompetency: "App Architecture & Modularization",
      difficulty: "EXPERT",
      keywordsExpected: ["hilt", "dagger", "modularization", "api", "implementation", "interface", "navigation", "loose coupling"],
      rationaleTemplate: "Evaluates large-scale code organization and scalable build design."
    }
  ],
  "Cloud Backend Engineer": [
    {
      id: "back_1",
      questionText: "What are the core trade-offs between REST and gRPC for internal microservice communication, particularly regarding throughput and streaming?",
      targetCompetency: "RESTful APIs & gRPC Architecture",
      difficulty: "INTERMEDIATE",
      keywordsExpected: ["grpc", "protobuf", "http/2", "binary", "rest", "json", "latency", "streaming"],
      rationaleTemplate: "Validates API protocol selection and network performance reasoning."
    },
    {
      id: "back_2",
      questionText: "How do you prevent cache breakdown (stampede) and cache penetration in high-throughput distributed systems using Redis?",
      targetCompetency: "Distributed Caching (Redis/Memcached)",
      difficulty: "ADVANCED",
      keywordsExpected: ["cache", "stampede", "mutex", "bloom filter", "ttl", "redis", "penetration", "singleflight"],
      rationaleTemplate: "Tests caching resilience under peak traffic spikes."
    },
    {
      id: "back_3",
      questionText: "Explain how PostgreSQL or MySQL B-Tree indexing works under the hood. When does a database optimizer choose a sequential scan over an index scan?",
      targetCompetency: "Database Indexing & Query Tuning",
      difficulty: "ADVANCED",
      keywordsExpected: ["b-tree", "index", "selectivity", "cardinality", "explain", "sequential scan", "io", "cost"],
      rationaleTemplate: "Examines deep relational database storage mechanics."
    },
    {
      id: "back_4",
      questionText: "Describe how you implement the Circuit Breaker pattern with fallback mechanisms to protect downstream systems during sudden cascading failures.",
      targetCompetency: "System Resilience & Circuit Breakers",
      difficulty: "EXPERT",
      keywordsExpected: ["circuit breaker", "half-open", "resilience4j", "fallback", "threshold", "cascading", "timeout"],
      rationaleTemplate: "Assesses distributed fault tolerance and mission-critical reliability."
    },
    {
      id: "back_5",
      questionText: "How do you ensure data consistency across multiple microservices in distributed transactions without using heavy two-phase commit (2PC)?",
      targetCompetency: "Distributed Systems & Concurrency",
      difficulty: "EXPERT",
      keywordsExpected: ["saga", "outbox", "eventual consistency", "idempotency", "kafka", "compensating transaction"],
      rationaleTemplate: "Tests architectural mastery of distributed data consistency."
    }
  ],
  "Web Developer": [
    {
      id: "web_1",
      questionText: "How does React's reconciliation algorithm and Virtual DOM diffing operate, and what practices avoid unnecessary re-renders in large component trees?",
      targetCompetency: "React State Management & Component Lifecycle",
      difficulty: "INTERMEDIATE",
      keywordsExpected: ["reconciliation", "virtual dom", "usememo", "usecallback", "memo", "state", "props", "fiber"],
      rationaleTemplate: "Evaluates frontend component architecture and reactive UI rendering efficiency."
    },
    {
      id: "web_2",
      questionText: "What architectural strategies and metrics do you use to diagnose and optimize Core Web Vitals, specifically LCP, INP, and CLS?",
      targetCompetency: "Web Performance & Core Web Vitals",
      difficulty: "ADVANCED",
      keywordsExpected: ["lcp", "inp", "cls", "core web vitals", "bundle", "code splitting", "hydration", "ssr"],
      rationaleTemplate: "Validates modern web performance auditing and production asset optimization."
    },
    {
      id: "web_3",
      questionText: "How do you leverage TypeScript's type system (generics, mapped types, conditional types) to build resilient, self-documenting web applications?",
      targetCompetency: "TypeScript & Modern JavaScript",
      difficulty: "ADVANCED",
      keywordsExpected: ["typescript", "generic", "interface", "type", "union", "narrowing", "mapped", "infer"],
      rationaleTemplate: "Tests static type safety and scalable frontend code design."
    },
    {
      id: "web_4",
      questionText: "How do you implement accessible keyboard navigation, focus management, and ARIA attributes for complex custom widgets like modal dialogs and dropdown menus?",
      targetCompetency: "Responsive Design & Accessibility (a11y)",
      difficulty: "INTERMEDIATE",
      keywordsExpected: ["aria", "focus trap", "tabindex", "keyboard", "wcag", "screen reader", "semantics"],
      rationaleTemplate: "Verifies frontend accessibility compliance and inclusive user experience design."
    }
  ],
  "Python Developer": [
    {
      id: "py_1",
      questionText: "Explain how Python's asyncio event loop handles cooperative multitasking, and when you should use multiprocessing over threading in Python.",
      targetCompetency: "Python Asynchronous Programming (asyncio)",
      difficulty: "INTERMEDIATE",
      keywordsExpected: ["asyncio", "event loop", "await", "coroutine", "thread", "gil", "multiprocessing"],
      rationaleTemplate: "Validates comprehension of Python concurrency models and non-blocking I/O."
    },
    {
      id: "py_2",
      questionText: "How do you structure high-throughput asynchronous APIs with FastAPI, handling Pydantic validation, dependency injection, and database connection pooling?",
      targetCompetency: "FastAPI / Django REST Framework",
      difficulty: "ADVANCED",
      keywordsExpected: ["fastapi", "pydantic", "validation", "async", "pool", "sqlalchemy", "orm", "dependency"],
      rationaleTemplate: "Probes modern Python backend architecture and API performance tuning."
    },
    {
      id: "py_3",
      questionText: "How does Python's memory management and garbage collection (reference counting plus cyclic GC) work, and how do you optimize memory consumption?",
      targetCompetency: "Data Structures & Algorithmic Efficiency",
      difficulty: "ADVANCED",
      keywordsExpected: ["reference count", "gc", "cyclic", "memory", "generator", "slots", "optimization"],
      rationaleTemplate: "Assesses memory profiling and internal Python runtime optimization."
    }
  ],
  "Java Developer": [
    {
      id: "java_1",
      questionText: "How does the Java Memory Model handle thread visibility, and how do volatile and synchronized prevent race conditions under high concurrency?",
      targetCompetency: "Java Multithreading & Memory Model",
      difficulty: "INTERMEDIATE",
      keywordsExpected: ["volatile", "synchronized", "happens-before", "thread", "memory", "visibility", "lock"],
      rationaleTemplate: "Examines core Java multithreading and thread synchronization fundamentals."
    },
    {
      id: "java_2",
      questionText: "How do you design and structure microservices with Spring Boot, handling distributed configurations, dependency injection, and health checks?",
      targetCompetency: "Spring Boot & Microservices",
      difficulty: "ADVANCED",
      keywordsExpected: ["spring", "boot", "injection", "actuator", "microservice", "config", "rest"],
      rationaleTemplate: "Evaluates modern Java microservice development with Spring framework."
    },
    {
      id: "java_3",
      questionText: "Explain the difference between optimistic and pessimistic locking in Hibernate/JPA, and how transaction isolation levels prevent phantom reads.",
      targetCompetency: "Hibernate & Database Transactions",
      difficulty: "ADVANCED",
      keywordsExpected: ["optimistic", "pessimistic", "locking", "transaction", "isolation", "phantom", "jpa"],
      rationaleTemplate: "Tests database concurrency and data integrity in Java ORM."
    }
  ],
  "Data Analyst": [
    {
      id: "data_1",
      questionText: "Explain how SQL window functions (such as ROW_NUMBER, RANK, DENSE_RANK, and LAG/LEAD) work, and how they differ from GROUP BY aggregations.",
      targetCompetency: "Advanced SQL & Window Functions",
      difficulty: "INTERMEDIATE",
      keywordsExpected: ["window", "partition by", "order by", "rank", "dense_rank", "group by", "lag"],
      rationaleTemplate: "Assesses advanced data querying and analytical SQL logic."
    },
    {
      id: "data_2",
      questionText: "How do you design a Kimball-style dimensional data warehouse schema (star vs snowflake) to ensure high query performance for business reporting?",
      targetCompetency: "Data Modeling & Warehousing",
      difficulty: "ADVANCED",
      keywordsExpected: ["star", "snowflake", "fact", "dimension", "schema", "grain", "normalization"],
      rationaleTemplate: "Probes dimensional data modeling and analytical schema design."
    },
    {
      id: "data_3",
      questionText: "How do you formulate hypothesis testing, calculate statistical significance (p-values, confidence intervals), and avoid common A/B testing pitfalls?",
      targetCompetency: "Statistical Analysis & Hypothesis Testing",
      difficulty: "ADVANCED",
      keywordsExpected: ["hypothesis", "significance", "p-value", "confidence interval", "sample size", "type i error"],
      rationaleTemplate: "Validates quantitative rigor and statistical decision-making."
    }
  ],
  "Machine Learning Engineer": [
    {
      id: "ml_1",
      questionText: "How do you approach quantization and pruning for deploying deep neural networks on edge or latency-sensitive production environments?",
      targetCompetency: "Model Optimization & Quantization",
      difficulty: "ADVANCED",
      keywordsExpected: ["quantization", "int8", "fp16", "pruning", "onnx", "tensorrt", "latency", "accuracy"],
      rationaleTemplate: "Evaluates production inference efficiency and model compression."
    },
    {
      id: "ml_2",
      questionText: "How do you detect and mitigate data drift and concept drift in live production inference pipelines, and what metrics trigger model retraining?",
      targetCompetency: "Evaluation Metrics & Drift Detection",
      difficulty: "EXPERT",
      keywordsExpected: ["drift", "psi", "ks-test", "retraining", "distribution", "baseline", "monitoring"],
      rationaleTemplate: "Tests ML monitoring, observability, and sustained model reliability."
    }
  ],
  "Technical Product Manager": [
    {
      id: "tpm_1",
      questionText: "When engineering leadership pushes back on a major product feature due to technical debt, how do you evaluate and negotiate trade-offs with stakeholders?",
      targetCompetency: "Technical Feasibility & Trade-offs",
      difficulty: "ADVANCED",
      keywordsExpected: ["trade-offs", "technical debt", "prioritization", "mvp", "stakeholders", "risk", "business value"],
      rationaleTemplate: "Assesses executive judgment, technical empathy, and roadmap negotiation."
    },
    {
      id: "tpm_2",
      questionText: "How do you construct North Star metrics and input metrics for a B2B SaaS platform to avoid optimizing for vanity numbers?",
      targetCompetency: "Data Analysis & Metric Design",
      difficulty: "ADVANCED",
      keywordsExpected: ["north star", "leading indicators", "retention", "cohorts", "activation", "funnel", "ltv"],
      rationaleTemplate: "Validates strategic metric definition and analytical alignment."
    }
  ]
};
