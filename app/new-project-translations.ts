import { cmsContent } from "./lib/cms-store";
import { gardenDetails, gardenDescriptions } from "./garden-projects";

export const newProjectTranslations: Record<"en" | "ru", { descriptions: Record<number, string>; newProjectDetails: Record<number, { summary: string; sections: { title: string; items: string[] }[] }> }> = cmsContent("new-project-translations-newProjectTranslations", {
  "en": {
    "descriptions": {
      ...gardenDescriptions("en"),
      "27": "A premium real-estate platform with listings, advanced search, neighborhoods, saved favorites, viewings and administration.",
      "28": "A premium medical website with specialties, doctors, transparent pricing and a guided seven-step booking journey.",
      "29": "A premium restaurant platform with a digital menu, reservations, online orders, checkout and an operational workspace.",
      "30": "A boutique-hotel digital experience with properties, rooms, availability, rates and direct booking.",
      "31": "A premium learning platform with study paths, courses, lessons, progress, quizzes and instructor experiences.",
      "32": "A SaaS workspace for leads, customers, pipelines, offers, automations and complete sales reporting.",
      "33": "An automotive e-commerce experience with a product catalog, promotions, search, favorites, cart, brands and installation services.",
      "35": "An apartment-building community with notices and resident participation.",
      "36": "A customer account for bills and meter readings.",
      "37": "An editorial bistro website with a seasonal menu.",
      "38": "A delivery menu with a side cart and order tracking.",
      "39": "Restaurant discovery with an interactive floor plan.",
      "40": "An interactive neighborhood atlas with local indicators.",
      "41": "Owner-listed homes with a viewing agenda.",
      "42": "A property catalog with comparison files.",
      "43": "Career learning paths with exercises and mentoring.",
      "44": "An institutional learning portal with a curriculum and assessment.",
      "45": "A practical-course studio with sample lessons.",
      "46": "A craft marketplace with maker stories and customization.",
      "47": "Offer comparison with a price history.",
      "48": "Local classified ads by category and town.",
      "49": "A getaway planner with a personal itinerary.",
      "50": "An apartment collection with an asymmetric gallery.",
      "51": "A hotel website with rooms, spa and restaurant experiences.",
      "52": "An architectural showcase of urban apartments.",
      "53": "Aftermarket kit comparison and service planning.",
      "54": "Wholesale purchasing through a table and a quotation.",
      "55": "A workshop workbench with an OEM parts inventory.",
      "56": "An auto-parts shop with vehicle-dependent selection.",
      "57": "A sales inbox with conversations and contact profiles.",
      "58": "A contact database with marketing segmentation.",
      "59": "A deal board organized by sales stage.",
      "60": "Guided consultation selection in three steps.",
      "61": "A doctor directory with availability by day.",
      "62": "A laboratory test catalog with a sample-collection list.",
      "63": "A clinic website presenting specialties and the care team.",
      "64": "An organizer console with an attendee register.",
      "65": "An editorial culture guide with a chronological agenda.",
      "66": "Concert posters and a ticket catalog."
    },
    "newProjectDetails": {
      ...gardenDetails("en"),
      "35": {
        "summary": "An apartment-building community with notices and resident participation.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "An apartment-building community with notices and resident participation",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Issue reports with status tracking",
              "One local demo vote per proposal",
              "Expense allocation by apartment and floor area"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "36": {
        "summary": "A customer account for bills and meter readings.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A customer account for bills and meter readings",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Simulated payment with an updated balance",
              "Validated meter readings",
              "Consumption history and downloadable bills"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "37": {
        "summary": "An editorial bistro website with a seasonal menu.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "An editorial bistro website with a seasonal menu",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Vegetarian and declared-allergen filters",
              "An exportable dish selection",
              "Planned visits"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "38": {
        "summary": "A delivery menu with a side cart and order tracking.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A delivery menu with a side cart and order tracking",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Products and order notes",
              "Zone-based delivery fees or pickup",
              "Orders with simulated preparation stages"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "39": {
        "summary": "Restaurant discovery with an interactive floor plan.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "Restaurant discovery with an interactive floor plan",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Date, time and party-size selection",
              "Table selection according to seating capacity",
              "Demo reservations and table release on cancellation"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "40": {
        "summary": "An interactive neighborhood atlas with local indicators.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "An interactive neighborhood atlas with local indicators",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "An interactive schematic map",
              "Price, transport and green-space layers",
              "An indicative estimate and export"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "41": {
        "summary": "Owner-listed homes with a viewing agenda.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "Owner-listed homes with a viewing agenda",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Your own property listings",
              "Viewing appointments with overlap checks",
              "A personal inspection checklist"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "42": {
        "summary": "A property catalog with comparison files.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A property catalog with comparison files",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Combined filters",
              "Property profiles",
              "Comparison of floor area, rooms and price per m²"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "43": {
        "summary": "Career learning paths with exercises and mentoring.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "Career learning paths with exercises and mentoring",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "A plan based on available study time",
              "A portfolio built through successive stages",
              "Mentoring sessions with overlap checks"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "44": {
        "summary": "An institutional learning portal with a curriculum and assessment.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "An institutional learning portal with a curriculum and assessment",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Reading modules",
              "An assessment unlocked through progress",
              "A downloadable demonstration completion record"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "45": {
        "summary": "A practical-course studio with sample lessons.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A practical-course studio with sample lessons",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "A topic-based course catalog",
              "Cohort selection",
              "Lessons, assessment and saved progress"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "46": {
        "summary": "A craft marketplace with maker stories and customization.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A craft marketplace with maker stories and customization",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Glaze and inscription choices",
              "Item quantities and gift packaging",
              "Orders that retain the selected options"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "47": {
        "summary": "Offer comparison with a price history.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "Offer comparison with a price history",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Compare and sort offers using delivery and availability",
              "Demonstration price history",
              "Saved price thresholds"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "48": {
        "summary": "Local classified ads by category and town.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "Local classified ads by category and town",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Publish and withdraw demo listings",
              "Favorites",
              "Reveal contact details"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "49": {
        "summary": "A getaway planner with a personal itinerary.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A getaway planner with a personal itinerary",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Accommodation by region and budget",
              "Local experiences",
              "Personal trip cost calculation and plan export"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "50": {
        "summary": "An apartment collection with an asymmetric gallery.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "An apartment collection with an asymmetric gallery",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Neighborhood filters",
              "A personal collection",
              "Accommodation requests with history and cancellation"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "51": {
        "summary": "A hotel website with rooms, spa and restaurant experiences.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A hotel website with rooms, spa and restaurant experiences",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Switch between stay, spa and dining experiences",
              "Configure a room and extra services",
              "Save stay packages locally"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "52": {
        "summary": "An architectural showcase of urban apartments.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "An architectural showcase of urban apartments",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Filtering by guest capacity",
              "Night count and total-price calculation",
              "Stay history and cancellation"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "53": {
        "summary": "Aftermarket kit comparison and service planning.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "Aftermarket kit comparison and service planning",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Vehicle garage and budget",
              "Specification comparison",
              "Estimates including installation and a saved appointment list"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "54": {
        "summary": "Wholesale purchasing through a table and a quotation.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "Wholesale purchasing through a table and a quotation",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Categories and warehouses",
              "Quantities limited by stock",
              "Volume discounts and downloadable quotations"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "55": {
        "summary": "A workshop workbench with an OEM parts inventory.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A workshop workbench with an OEM parts inventory",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "OEM code search",
              "A maintenance kit",
              "Stock allocation to work orders and export"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "56": {
        "summary": "An auto-parts shop with vehicle-dependent selection.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "An auto-parts shop with vehicle-dependent selection",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Make, model and engine selection",
              "Demonstration compatibility filters",
              "Cart, quantities and order history"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "57": {
        "summary": "A sales inbox with conversations and contact profiles.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A sales inbox with conversations and contact profiles",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Demo replies and internal notes",
              "Separate drafts for each conversation",
              "Follow-up scheduling and conversation resolution"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "58": {
        "summary": "A contact database with marketing segmentation.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A contact database with marketing segmentation",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Editable contacts",
              "Subscription management",
              "Local demo campaigns for eligible recipients"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "59": {
        "summary": "A deal board organized by sales stage.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A deal board organized by sales stage",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Create and edit deals",
              "Move deals between stages by dragging or using a selector",
              "Activities and deal totals"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "60": {
        "summary": "Guided consultation selection in three steps.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "Guided consultation selection in three steps",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Matching by specialty, language and consultation type",
              "Demo appointment booking",
              "A visit agenda"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "61": {
        "summary": "A doctor directory with availability by day.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A doctor directory with availability by day",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Specialty and neighborhood filters",
              "Demo time-slot booking",
              "Cancellation makes the time slot available again"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "62": {
        "summary": "A laboratory test catalog with a sample-collection list.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A laboratory test catalog with a sample-collection list",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Search by test name or code",
              "A basket of selected tests",
              "Collection-center selection and request history"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "63": {
        "summary": "A clinic website presenting specialties and the care team.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "A clinic website presenting specialties and the care team",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Specialist selection",
              "Demo appointments with time-slot validation",
              "Appointment history and cancellation"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "64": {
        "summary": "An organizer console with an attendee register.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "An organizer console with an attendee register",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Demo ticket issuance",
              "Attendee check-in and cancellation",
              "CSV export and event capacity tracking"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "65": {
        "summary": "An editorial culture guide with a chronological agenda.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "An editorial culture guide with a chronological agenda",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Filters by day and interest",
              "A personal agenda",
              "Weekend schedule export"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      },
      "66": {
        "summary": "Concert posters and a ticket catalog.",
        "sections": [
          {
            "title": "Design and structure",
            "items": [
              "Concert posters and a ticket catalog",
              "A distinct interface with desktop and mobile layouts"
            ]
          },
          {
            "title": "Demo functionality",
            "items": [
              "Event filtering",
              "Ticket categories and quantities",
              "Saved demo orders and downloadable confirmations"
            ]
          },
          {
            "title": "What the buyer receives",
            "items": [
              "Independent, editable source code",
              "Static export integrated into the catalog",
              "Tested local workflows; real services require separate integration",
              "Demo actions are saved in this browser. No real payments, bookings or message delivery take place"
            ]
          }
        ]
      }
    }
  },
  "ru": {
    "descriptions": {
      ...gardenDescriptions("ru"),
      "27": "Премиальная платформа недвижимости с объектами, расширенным поиском, районами, избранным, просмотрами и администрированием.",
      "28": "Премиальный медицинский сайт со специальностями, врачами, прозрачными ценами и записью в семь понятных шагов.",
      "29": "Премиальная платформа ресторана с цифровым меню, бронированием, онлайн-заказами, оплатой и рабочим кабинетом.",
      "30": "Цифровой опыт для бутик-отеля с объектами, номерами, доступностью, тарифами и прямым бронированием.",
      "31": "Премиальная LMS-платформа с учебными программами, курсами, уроками, прогрессом, тестами и опытом для преподавателей.",
      "32": "SaaS-рабочее пространство для лидов, клиентов, воронок, предложений, автоматизаций и полной отчётности по продажам.",
      "33": "Автомобильный интернет-магазин с каталогом, акциями, поиском, избранным, корзиной, брендами и услугами установки.",
      "35": "Сообщество многоквартирного дома с объявлениями и участием жильцов.",
      "36": "Личный кабинет потребителя со счетами и показаниями счётчика.",
      "37": "Сайт бистро в журнальном стиле с сезонным меню.",
      "38": "Меню доставки с боковой корзиной и отслеживанием заказа.",
      "39": "Выбор ресторана с интерактивным планом зала.",
      "40": "Интерактивный атлас районов с местными показателями.",
      "41": "Жильё от собственников с расписанием просмотров.",
      "42": "Каталог недвижимости с досье для сравнения.",
      "43": "Карьерные учебные траектории с упражнениями и наставничеством.",
      "44": "Образовательный портал учреждения с программой и проверкой знаний.",
      "45": "Студия практических курсов с пробными уроками.",
      "46": "Маркетплейс изделий ручной работы с историями мастеров и персонализацией.",
      "47": "Сравнение предложений с историей цен.",
      "48": "Местные объявления по категориям и населённым пунктам.",
      "49": "Планировщик поездок с личным маршрутом.",
      "50": "Коллекция апартаментов с асимметричной галереей.",
      "51": "Сайт отеля с номерами, спа и рестораном.",
      "52": "Архитектурная презентация городских апартаментов.",
      "53": "Сравнение комплектов автозапчастей и планирование обслуживания.",
      "54": "Оптовые закупки через таблицу и расчёт предложения.",
      "55": "Рабочая панель автосервиса со складом запчастей по OEM-кодам.",
      "56": "Магазин автозапчастей с подбором по автомобилю.",
      "57": "Почтовый ящик отдела продаж с перепиской и карточками контактов.",
      "58": "База контактов с сегментацией для маркетинга.",
      "59": "Доска сделок по этапам продаж.",
      "60": "Пошаговый подбор консультации в три этапа.",
      "61": "Каталог врачей с расписанием по дням.",
      "62": "Каталог анализов со списком для сдачи в лаборатории.",
      "63": "Сайт клиники с направлениями лечения и командой специалистов.",
      "64": "Панель организатора с реестром участников.",
      "65": "Редакционный гид по культурным событиям с хронологической афишей.",
      "66": "Концертная афиша и каталог билетов."
    },
    "newProjectDetails": {
      ...gardenDetails("ru"),
      "35": {
        "summary": "Сообщество многоквартирного дома с объявлениями и участием жильцов.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Сообщество многоквартирного дома с объявлениями и участием жильцов",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Заявки о проблемах с отслеживанием статуса",
              "Один локальный демоголос на каждое предложение",
              "Распределение расходов по квартирам и площади"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "36": {
        "summary": "Личный кабинет потребителя со счетами и показаниями счётчика.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Личный кабинет потребителя со счетами и показаниями счётчика",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Имитация оплаты с обновлением баланса",
              "Проверка показаний счётчика",
              "История потребления и скачивание счетов"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "37": {
        "summary": "Сайт бистро в журнальном стиле с сезонным меню.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Сайт бистро в журнальном стиле с сезонным меню",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Фильтры вегетарианских блюд и указанных аллергенов",
              "Экспорт подборки блюд",
              "Планирование визитов"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "38": {
        "summary": "Меню доставки с боковой корзиной и отслеживанием заказа.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Меню доставки с боковой корзиной и отслеживанием заказа",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Блюда и комментарии к заказу",
              "Стоимость доставки по зонам или самовывоз",
              "Заказы с имитацией этапов приготовления"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "39": {
        "summary": "Выбор ресторана с интерактивным планом зала.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Выбор ресторана с интерактивным планом зала",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Выбор даты, времени и числа гостей",
              "Подбор стола по вместимости",
              "Демонстрационные бронирования и освобождение стола при отмене"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "40": {
        "summary": "Интерактивный атлас районов с местными показателями.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Интерактивный атлас районов с местными показателями",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Интерактивная схематическая карта",
              "Слои цен, транспорта и зелёных зон",
              "Ориентировочный расчёт и экспорт"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "41": {
        "summary": "Жильё от собственников с расписанием просмотров.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Жильё от собственников с расписанием просмотров",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Собственные объявления",
              "Запись на просмотр с проверкой пересечений по времени",
              "Личный список проверки жилья"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "42": {
        "summary": "Каталог недвижимости с досье для сравнения.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Каталог недвижимости с досье для сравнения",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Комбинированные фильтры",
              "Карточки объектов",
              "Сравнение площади, числа комнат и цены за м²"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "43": {
        "summary": "Карьерные учебные траектории с упражнениями и наставничеством.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Карьерные учебные траектории с упражнениями и наставничеством",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "План с учётом доступного времени на обучение",
              "Портфолио с последовательными этапами",
              "Сессии с наставником с проверкой пересечений по времени"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "44": {
        "summary": "Образовательный портал учреждения с программой и проверкой знаний.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Образовательный портал учреждения с программой и проверкой знаний",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Учебные модули для чтения",
              "Открытие проверки знаний по мере прохождения",
              "Скачивание демонстрационного подтверждения прохождения"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "45": {
        "summary": "Студия практических курсов с пробными уроками.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Студия практических курсов с пробными уроками",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Каталог курсов по темам",
              "Выбор учебной группы",
              "Уроки, проверка знаний и сохранение прогресса"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "46": {
        "summary": "Маркетплейс изделий ручной работы с историями мастеров и персонализацией.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Маркетплейс изделий ручной работы с историями мастеров и персонализацией",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Выбор глазури и надписи",
              "Количество изделий и подарочная упаковка",
              "Заказы с сохранением выбранных параметров"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "47": {
        "summary": "Сравнение предложений с историей цен.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Сравнение предложений с историей цен",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Сравнение и сортировка с учётом доставки и наличия",
              "Демонстрационная история цен",
              "Сохранение ценовых порогов"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "48": {
        "summary": "Местные объявления по категориям и населённым пунктам.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Местные объявления по категориям и населённым пунктам",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Публикация и снятие демонстрационных объявлений",
              "Избранное",
              "Просмотр контактных данных"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "49": {
        "summary": "Планировщик поездок с личным маршрутом.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Планировщик поездок с личным маршрутом",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Подбор жилья по региону и бюджету",
              "Местные впечатления и занятия",
              "Расчёт стоимости поездки и экспорт личного плана"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "50": {
        "summary": "Коллекция апартаментов с асимметричной галереей.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Коллекция апартаментов с асимметричной галереей",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Фильтрация по районам",
              "Личная подборка",
              "Заявки на проживание с историей и отменой"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "51": {
        "summary": "Сайт отеля с номерами, спа и рестораном.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Сайт отеля с номерами, спа и рестораном",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Переключение между проживанием, спа и рестораном",
              "Настройка номера и дополнительных услуг",
              "Локальное сохранение пакетов проживания"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "52": {
        "summary": "Архитектурная презентация городских апартаментов.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Архитектурная презентация городских апартаментов",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Фильтрация по числу гостей",
              "Расчёт количества ночей и общей стоимости",
              "История проживания и отмена"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "53": {
        "summary": "Сравнение комплектов автозапчастей и планирование обслуживания.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Сравнение комплектов автозапчастей и планирование обслуживания",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Гараж автомобилей и бюджет",
              "Сравнение характеристик",
              "Расчёт с установкой и список сохранённых записей в сервис"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "54": {
        "summary": "Оптовые закупки через таблицу и расчёт предложения.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Оптовые закупки через таблицу и расчёт предложения",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Категории и склады",
              "Количество в пределах складского остатка",
              "Скидки за объём и скачивание коммерческого предложения"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "55": {
        "summary": "Рабочая панель автосервиса со складом запчастей по OEM-кодам.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Рабочая панель автосервиса со складом запчастей по OEM-кодам",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Поиск по OEM-коду",
              "Комплект для технического обслуживания",
              "Резервирование запчастей в заказ-нарядах и экспорт"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "56": {
        "summary": "Магазин автозапчастей с подбором по автомобилю.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Магазин автозапчастей с подбором по автомобилю",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Выбор марки, модели и двигателя",
              "Демонстрационная фильтрация совместимости",
              "Корзина, количество товаров и история заказов"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "57": {
        "summary": "Почтовый ящик отдела продаж с перепиской и карточками контактов.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Почтовый ящик отдела продаж с перепиской и карточками контактов",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Демонстрационные ответы и внутренние заметки",
              "Отдельные черновики для каждой переписки",
              "Планирование повторного контакта и закрытие переписки"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "58": {
        "summary": "База контактов с сегментацией для маркетинга.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "База контактов с сегментацией для маркетинга",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Редактирование контактов",
              "Управление подпиской",
              "Локальные демокампании для подходящих получателей"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "59": {
        "summary": "Доска сделок по этапам продаж.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Доска сделок по этапам продаж",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Создание и редактирование сделок",
              "Перемещение между этапами перетаскиванием или через список",
              "Задачи и итоговые суммы сделок"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "60": {
        "summary": "Пошаговый подбор консультации в три этапа.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Пошаговый подбор консультации в три этапа",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Подбор по специальности, языку и формату консультации",
              "Демонстрационная запись на приём",
              "Расписание визитов"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "61": {
        "summary": "Каталог врачей с расписанием по дням.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Каталог врачей с расписанием по дням",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Фильтры по специальности и району",
              "Демонстрационная запись на выбранное время",
              "Освобождение времени при отмене записи"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "62": {
        "summary": "Каталог анализов со списком для сдачи в лаборатории.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Каталог анализов со списком для сдачи в лаборатории",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Поиск по названию или коду анализа",
              "Корзина выбранных исследований",
              "Выбор пункта сдачи анализов и история заявок"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "63": {
        "summary": "Сайт клиники с направлениями лечения и командой специалистов.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Сайт клиники с направлениями лечения и командой специалистов",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Выбор специалиста",
              "Демонстрационная запись с проверкой времени",
              "История записей и отмена"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "64": {
        "summary": "Панель организатора с реестром участников.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Панель организатора с реестром участников",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Выпуск демонстрационных билетов",
              "Отметка о прибытии и отмена билета",
              "Экспорт CSV и учёт вместимости события"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "65": {
        "summary": "Редакционный гид по культурным событиям с хронологической афишей.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Редакционный гид по культурным событиям с хронологической афишей",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Фильтры по дням и интересам",
              "Личная афиша",
              "Экспорт программы на выходные"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      },
      "66": {
        "summary": "Концертная афиша и каталог билетов.",
        "sections": [
          {
            "title": "Дизайн и структура",
            "items": [
              "Концертная афиша и каталог билетов",
              "Собственный интерфейс с версиями для компьютера и телефона"
            ]
          },
          {
            "title": "Демонстрационные возможности",
            "items": [
              "Фильтрация событий",
              "Категории и количество билетов",
              "Сохранение демозаказов и скачивание подтверждений"
            ]
          },
          {
            "title": "Что получает покупатель",
            "items": [
              "Отдельный редактируемый исходный код",
              "Статический экспорт, встроенный в каталог",
              "Проверенные локальные сценарии; реальные сервисы подключаются отдельно",
              "Демонстрационные действия сохраняются в этом браузере. Реальные платежи, бронирования и отправка сообщений не выполняются"
            ]
          }
        ]
      }
    }
  }
});
