// All site copy lives here. Edit this file to update the portfolio.

export type Lang = "tr" | "en";
type T = Record<Lang, string>;

export const profile = {
  name: "Oğuzhan Karaburç",
  handle: "oguzhan",
  title: { tr: "Yazılım Mühendisi", en: "Software Engineer" } as T,
  location: { tr: "İstanbul / Ordu", en: "Istanbul / Ordu, Türkiye" } as T,
  email: "oguzhankaraburc@gmail.com",
  github: "https://github.com/oguzhankaraburc",
  linkedin: "https://www.linkedin.com/in/oğuzhankaraburç",  about: {
    tr: [
      "Temmuz 2025'te İstanbul Topkapı Üniversitesi Yazılım Mühendisliği bölümünden mezun oldum.",
      "Ağırlıklı olarak Frontend Development alanında çalışıyor ve bu alanda uzmanlaşmayı hedefliyorum. Veri tabanı yönetim sistemleri konusunda da bilgi sahibiyim.",
      "Eğitimim boyunca web teknolojileri ve mobil uygulama geliştirme üzerine akademik projeler yaptım.",
      "Takım çalışmasına uyumlu, öğrenmeye açık ve yeni teknolojilere hızla adapte olan biriyim. Değer üretebileceğim bir ekipte yer almak istiyorum.",
    ],
    en: [
      "I graduated in Software Engineering from Istanbul Topkapı University in July 2025.",
      "I mainly work on frontend development and aim to specialize in it. I also have a solid grounding in database management systems.",
      "During my studies I built academic projects in web technologies and mobile app development.",
      "I'm a team player, eager to learn and quick to adapt to new technologies. I'm looking for a team where I can create real value.",
    ],
  } as Record<Lang, string[]>,
};

export const experience = [
  {
    company: "INNOEM Sustainability and Innovation Consultancy Network",
    role: { tr: "Frontend Development Stajyeri", en: "Frontend Development Intern" } as T,
    period: { tr: "Şubat 2025 – Haziran 2025", en: "Feb 2025 – Jun 2025" } as T,
    points: {
      tr: [
        "Vue.js ve Tailwind CSS ile şirketin sürdürülebilirlik paneli için arayüz bileşenleri geliştirdim.",
        "UI/UX tasarımlarını responsive web sayfalarına dönüştürdüm.",
      ],
      en: [
        "Built UI components for the company's sustainability dashboard with Vue.js and Tailwind CSS.",
        "Turned UI/UX designs into responsive web pages.",
      ],
    } as Record<Lang, string[]>,
    stack: ["Vue.js", "Tailwind CSS"],
  },
];

export const education = [
  {
    school: "İstanbul Topkapı Üniversitesi",
    dept: { tr: "Yazılım Mühendisliği", en: "Software Engineering" } as T,
    period: "2022 – 2025",
  },
  {
    school: "Samsun Üniversitesi",
    dept: { tr: "Makine Mühendisliği", en: "Mechanical Engineering" } as T,
    period: "2021 – 2022",
  },
];

export const skills: Record<string, string[]> = {
  frontend: ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "Tailwind CSS"],
  backend: ["Node.js", "Java", "MySQL"],
  tools: ["Git", "GitHub", "REST API", "UI/UX"],
};

export const languages = [
  { name: { tr: "Türkçe", en: "Turkish" } as T, level: { tr: "Ana dil", en: "Native" } as T },
  { name: { tr: "İngilizce", en: "English" } as T, level: { tr: "B1", en: "B1" } as T },
];

export const certificates = [
  { name: "Front-End Okulu", org: "Coderspace", date: "2024-11" },
  { name: "TÜBİTAK BİLGEM YTE Bootcamp: Java", org: "TÜBİTAK BİLGEM", date: "2023-10" },
  { name: "TÜBİTAK BİLGEM YTE Bootcamp: Microservice Architectures", org: "TÜBİTAK BİLGEM", date: "2023-10" },
  { name: "CSS Temelleri", org: "BTK Akademi", date: "2023-07" },
  { name: "HTML5 ile Web Geliştirme", org: "BTK Akademi", date: "2023-06" },
  { name: "Python Programlama 101", org: "Turkcell Akademi", date: "2023-06" },
  { name: "Bilgi Teknolojilerine Giriş", org: "BTK Akademi", date: "2022-10" },
];

// Projects. `app` opens a window inside the OS; `live` / `repo` open external links.
export type Project = {
  id: string;
  name: string;
  summary: T;
  stack: string[];
  repo: string;
  live?: string;
  app?: "taskmanager";
  featured?: boolean;
};

const gh = "https://github.com/oguzhankaraburc/";

export const projects: Project[] = [
  {
    id: "task-manager",
    name: "Task Management",
    summary: {
      tr: "Rol bazlı yetkilendirme, gerçek zamanlı bildirimler ve sürükle-bırak Kanban ile full-stack görev yönetimi.",
      en: "Full-stack task management with role-based access, real-time notifications and a drag-and-drop Kanban.",
    },
    stack: ["React", "Express", "PostgreSQL", "Socket.io"],
    repo: gh + "task-management-case",
    app: "taskmanager",
    featured: true,
  },
  // New projects go here. Optional fields: `live` for a demo link, `app` to open a window inside the OS.
];

export const taskManager = {
  intro: {
    tr: "Bir organizasyondaki proje ve görevleri rol bazlı yetkilendirme (RBAC) ile yöneten full-stack bir uygulama. Admin tüm sistemi yönetir, kullanıcılar yalnızca kendilerine atanan işleri görür. Uygulama verileri analiz edip kullanıcılara ve yöneticilere içgörüler de sunar.",
    en: "A full-stack app that manages an organization's projects and tasks with role-based access control (RBAC). Admins run the whole system; users only see the work assigned to them. It also analyzes the data and surfaces insights for users and managers.",
  } as T,
  features: [
    { icon: "🔐", title: { tr: "JWT kimlik doğrulama", en: "JWT authentication" }, body: { tr: "Token tabanlı oturum, bcrypt ile şifre hash'leme.", en: "Token-based sessions, passwords hashed with bcrypt." } },
    { icon: "🛡️", title: { tr: "Rol bazlı yetki", en: "Role-based access" }, body: { tr: "Admin kullanıcı ve proje tanımlar; User kendi projelerinde görev açar ve günceller.", en: "Admins create users and projects; users create and update tasks in their own projects." } },
    { icon: "⚡", title: { tr: "Gerçek zamanlı", en: "Real-time" }, body: { tr: "Socket.io ile bildirimler ve istatistikler sayfa yenilenmeden güncellenir.", en: "Notifications and stats update live over Socket.io, no refresh." } },
    { icon: "🗂️", title: { tr: "Kanban board", en: "Kanban board" }, body: { tr: "Optimistic UI ile gecikmesiz sürükle-bırak.", en: "Lag-free drag and drop with optimistic UI." } },
    { icon: "📊", title: { tr: "Analiz paneli", en: "Analytics" }, body: { tr: "Recharts ile role özel istatistik kartları ve grafikler.", en: "Role-specific stat cards and charts with Recharts." } },
    { icon: "📅", title: { tr: "Takvim ve denetim", en: "Calendar & audit" }, body: { tr: "Takvim görünümü, admin için görev denetimi ve kullanıcı yönetimi.", en: "Calendar view, plus task audit and user management for admins." } },
  ] as { icon: string; title: T; body: T }[],
  stack: {
    frontend: ["React (Vite)", "Tailwind CSS v4", "Axios", "Context API", "Recharts", "Framer Motion"],
    backend: ["Node.js", "Express", "PostgreSQL", "Sequelize", "Socket.io", "JWT", "Bcrypt"],
  },
  // Put screenshots in public/projects/task-manager/ and list them here, e.g. "/projects/task-manager/dashboard.png"
  screenshots: [
    { src: "/projects/task-manager/dashboard_dark.png", caption: { tr: "Görev paneli — Kanban (karanlık tema)", en: "Task board — Kanban (dark theme)" } },
    { src: "/projects/task-manager/project_center.png", caption: { tr: "Proje merkezi — admin görünümü", en: "Project center — admin view" } },
    { src: "/projects/task-manager/dashboard_light.png", caption: { tr: "Görev paneli (aydınlık tema)", en: "Task board (light theme)" } },
    { src: "/projects/task-manager/profile_modal.png", caption: { tr: "Profil ayarları ve avatar seçimi", en: "Profile settings and avatar picker" } },
    { src: "/projects/task-manager/login_dark.png", caption: { tr: "Giriş ekranı", en: "Login screen" } },
  ] as { src: string; caption: T }[],
};

// UI strings
export const ui = {
  boot_skip: { tr: "geçmek için bir tuşa bas", en: "press any key to skip" },
  boot_skip_touch: { tr: "geçmek için ekrana dokun", en: "tap to skip" },
  open: { tr: "Aç", en: "Open" },
  welcome: {
    tr: "oguzhan.os'a hoş geldin. Komutlar için 'help' yaz.",
    en: "Welcome to oguzhan.os. Type 'help' for commands.",
  },
} satisfies Record<string, T>;
