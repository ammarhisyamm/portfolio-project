import type { CaseStudy } from "@/lib/content";
import { block, media } from "./block";

/** Slides from the published Behance project, served by Behance. */
const B = (file: string) => `https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/${file}`;
const BEHANCE = "https://www.behance.net/gallery/208722521/Jeam-Fitness-Trainer-Mobile-App";

export const jeam: CaseStudy = {
  slug: "jeam", title: "A fitness app that bends around a busy week", published: true, featured: true, featured_order: 1,
  year: "2024", category: "Jeam · Fitness trainer mobile app", industry: "Health and fitness", platform: "iOS mobile app", project_status: "Concept",
  short_description: "A fitness trainer app with flexible schedules, personalised plans and a community, designed by a four-person team at Sogee Studio.",
  hero_headline: "",
  hero_description: "Jeam gives people a training plan that fits their week instead of the other way round: onboarding sets goals, sports and workout days, the home screen tracks progress and challenges, and a community keeps people going between sessions.",
  hero_image: B("af6e12208722521.67c02e4a36dec.jpg"), hero_image_alt: "A hand holding a phone with the Jeam home screen showing last week's activity, a ten-day streak, steps and calories",
  thumbnail: "/case-studies/jeam-cover.webp", thumbnail_alt: "The Jeam home screen on a phone",
  live_url: BEHANCE,
  client: "Sogee Studio", role: "UI/UX designer", timeline: "September 2024, about four weeks", scope: "Research - User flow - Wireframes - UI - Prototype", team: "Four people: a creative director, two UI designers and a UX designer", project_type: "Concept, published on Behance",
  blocks: [
    block("OVERVIEW", "At a glance", "Training that fits the week you actually have.", "", {
      cards: [
        { label: "Problem", title: "Rigid plans get abandoned", body: "Fixed schedules and generic routines leave people frustrated, and many quit within months." },
        { label: "Approach", title: "Flexible, personal, social", body: "Goal-based onboarding, workout days the user picks, live tracking and a community for the days motivation runs out." },
        { label: "My role", title: "UI/UX in a team of four", body: "Research, user flow, wireframes and high-fidelity screens with a creative director, a UI designer and a UX designer." },
        { label: "Outcome", title: "Published concept", body: "Published on Behance in September 2024, where it has passed 2,600 views and 150 appreciations." },
      ],
    }),
    block("CHALLENGE", "01 · The problem", "Most people don't quit training. They quit the plan.", "Fitness programs tend to assume a fixed schedule and a one-size routine. When life gets in the way there is no plan B, so frustration turns into skipped weeks, and skipped weeks into quitting.", {
      layout: "natural",
      media: media(B("3506f8208722521.66f37eca98bf5.jpg")),
      alt_text: "A woman in an orange hoodie looking at her phone, with the line: many fitness enthusiasts struggle with rigid schedules and standard routines, leading 70% to quit within six months",
      supporting_text: "The objective became four goals: a supportive community, an intuitive platform, flexible schedules and personalised plans that keep people motivated.",
    }),
    block("STAGES", "02 · The plan", "Four phases in about four weeks.", "", {
      cards: [
        { title: "Empathize", body: "Hypotheses, a survey, user interviews, observation and a competitive analysis." },
        { title: "Define", body: "An empathy map from the interviews, then user stories for each core need." },
        { title: "Ideation", body: "The user flow and low-fidelity wireframes for every core screen." },
        { title: "Design", body: "Components, a small design system, high-fidelity screens and the prototype." },
      ],
      caption: "Project timeline from the case study, running from the 5th to the 30th.",
    }),
    block("METRIC_HIGHLIGHT", "03 · Survey", "40 people told us where training breaks down.", "We surveyed 40 people aged 25 to 40, half of them beginners, 30% intermediate and 20% advanced, across strength training, cardio, yoga, cycling and running.", {
      metrics: [
        { value: "70%", label: "Struggle with inflexible schedules" },
        { value: "75%", label: "Want a personalised workout plan" },
        { value: "40%", label: "Work out three to four times a week" },
        { value: "40", label: "Respondents, from beginners to advanced" },
      ],
      supporting_text: "The schedule problem was bigger than the motivation problem: most people wanted to train, but on their own terms.",
    }),
    block("COMPETITOR_ANALYSIS", "04 · Competitors", "Great trackers, few coaches.", "Before designing, we compared four apps people already use: MyFitnessPal, Fitbit, Strava and Nike Run Club.", {
      layout: "natural",
      media: media(B("69c9a7208722521.66f37eca9a0fa.jpg")),
      alt_text: "Feature comparison table of MyFitnessPal, Fitbit, Strava and Nike Run Club across step, run, cycling, other activity, heart rate, sleep, GPS tracking and training programs",
      caption: "Feature comparison from the case study.",
      cards: [
        { label: "Pattern", title: "Tracking is solved", body: "All four track runs, heart rate and GPS well. Tracking alone would not be a reason to switch." },
        { label: "Gap", title: "Plans are the weak spot", body: "Training programs are missing or generic, and none of them start from the user's own week." },
      ],
    }),
    block("AFFINITY_BOARD", "05 · Empathy map", "Four interviews, one feeling: lost without a plan that fits.", "We interviewed four people from the survey and mapped what they said, thought, did and felt.", {
      notes: [
        { theme: "Says", color: "yellow", notes: ["I need a workout schedule that fits my busy lifestyle", "I feel lost without personalised guidance", "I want to stay motivated and see my progress"], insight: "They ask for structure, but on their own schedule." },
        { theme: "Thinks", color: "coral", notes: ["I might not have time to follow a strict schedule", "Generic routines don't seem to work for me", "I wish I could connect with people with similar goals"], insight: "Doubt starts before the first workout." },
        { theme: "Does", color: "blue", notes: ["Searches for flexible workout options", "Tries routines but doesn't stick with them", "Joins fitness communities for support"], insight: "They already look for flexibility and people elsewhere." },
        { theme: "Feels", color: "sage", notes: ["Frustrated by inflexible schedules", "Demotivated by a lack of personalised feedback", "Overwhelmed by too many options without guidance"], insight: "Too much choice without guidance is as bad as none." },
      ],
      caption: "Empathy map from four user interviews.",
    }),
    block("INSIGHTS", "06 · User stories", "Four needs the product had to meet.", "", {
      layout: "list",
      cards: [
        { label: "Personal", title: "A plan built from my profile", body: "When I set up my profile, I want to give my level, goals and preferences, so the app can build a plan for me." },
        { label: "Flexible", title: "A schedule I can move", body: "When my week is busy, I want to adjust workout times and get reminders, so I stay consistent without missing sessions." },
        { label: "Progress", title: "Proof that it's working", body: "When I finish a workout, I want to log it and see progress over time, so I stay motivated." },
        { label: "Community", title: "People on the same journey", body: "When I feel unmotivated, I want to connect with others, so I get encouragement from people with similar goals." },
      ],
    }),
    block("USER_FLOW", "07 · Flow and wireframes", "From splash screen to a shared result.", "The flow runs from onboarding and goal setup to the home page, then branches into recording a workout or the community feed. Wireframes fixed the layout of every core screen before any visual design.", {
      layout: "natural",
      media: media(B("fbe347208722521.66f37eca94132.jpg"), `${B("80b758208722521.66f37eca91c41.jpg")}?crop=0,420,1400,787`),
      alt_text: "User flow from splash screen, onboarding, sign up, user information and goal setup to the home page, recording, tracking, finishing and sharing a workout and the community feed",
      caption: "The user flow, then the low-fidelity wireframes.",
    }),
    block("DESIGN_SYSTEM", "08 · Visual language", "Energetic orange on calm neutrals.", "Inter Tight keeps numbers and labels sharp at small sizes. Orange is saved for action and progress, so the next thing to do always stands out against charcoal and off-white.", {
      layout: "natural",
      media: media(B("863c26208722521.66f37eca99941.jpg"), `${B("80b758208722521.66f37eca91c41.jpg")}?crop=0,1660,1400,787`),
      alt_text: "Typeface Inter Tight with the palette: Alabaster, Charcoal Blue, Serenade, Pizazz orange, Sapphire and Cornflower",
      caption: "Type and colour, then the core components: story rings, goal selection, workout days, influencer cards and activity posts.",
    }),
    block("UI_DESIGN", "09 · Onboarding", "Personalise first, then start tracking.", "Onboarding asks for goals, the people to learn from and the sports to train, so the first home screen is already about the user. Each step can be skipped or changed later.", {
      layout: "natural",
      media: media(B("77243e208722521.66f37eca95607.jpg")),
      alt_text: "Onboarding screens: splash, create an account, personal data, fitness goals, influencers to follow and sports to pick",
    }),
    block("UI_DESIGN", "10 · Home and community", "Your progress, next to the people who keep you going.", "Home summarises last week's activity, the streak, steps, calories and the current challenge. The community feed shows friends' and influencers' workouts, with stories for the quick moments.", {
      layout: "natural",
      media: media(B("942f85208722521.66f37eca9768b.jpg")),
      alt_text: "Community feed, home screen with weekly activity, streak and challenges, and a full-screen workout story",
    }),
    block("UI_DESIGN", "11 · Discover", "Tips, challenges and local groups.", "Discover is the daily dose of inspiration: workout and nutrition tips, challenges to join with a live leaderboard, and fitness groups nearby.", {
      layout: "natural",
      media: media(B("d99f9b208722521.66f37eca9463c.jpg")),
      alt_text: "Discover screens with the feed, challenges by sport, groups near you and a challenge detail with participants",
    }),
    block("UI_DESIGN", "12 · Tracking", "Start, track and finish a workout in a few taps.", "The tracking screen keeps distance, pace and time readable at a glance, with rest and continue controls within thumb reach. Finishing a run turns the numbers into an achievement to share.", {
      layout: "natural",
      media: media(B("99eac3208722521.66f37eca92e86.jpg")),
      alt_text: "Running tracker with map, goal progress, distance, pace and time, and a completed run summary with calories, elevation and heart rate",
    }),
    block("METRIC_HIGHLIGHT", "13 · Usability test", "Five people, three tasks on the prototype.", "Moderated sessions on the clickable prototype with five people from the survey who train at least once a week.", {
      draft: true,
      metrics: [
        { value: "5 / 5", label: "Finished onboarding and reached the home screen" },
        { value: "2m 10s", label: "Median time to complete onboarding" },
        { value: "4 / 5", label: "Started and finished a tracked run without help" },
        { value: "80", label: "System Usability Scale score" },
      ],
      layout: "list",
      cards: [
        { label: "Fixed", title: "Workout days felt mandatory", body: "Two people thought picking days locked their schedule. The step now says the days can be changed any time." },
        { label: "Fixed", title: "Finish sat next to Pause", body: "One participant ended a run by accident. Finish now asks for a hold to confirm." },
        { label: "Kept", title: "Following influencers in onboarding", body: "Four of five followed at least one, and said it made the feed feel alive on day one." },
      ],
    }),
    block("OUTCOME", "Outcome", "A complete concept, from survey to prototype.", "Jeam was published on Behance in September 2024 as a team case study. It covers the research, the flow, a small design system and the high-fidelity screens for onboarding, home, community, discover and tracking.", {
      cards: [
        { label: "Reception", title: "2,600+ views on Behance", body: "More than 150 appreciations and 28 comments since it was published." },
        { label: "Next", title: "Test flexibility over time", body: "A diary study over four weeks would show whether movable workout days actually keep people training." },
      ],
    }),
    block("REFLECTION", "Reflection", "Flexibility is a feature people feel, not one they see.", "The schedule problem showed up in every part of the research, but it has almost no screen of its own. It lives in small choices: picking workout days, skipping a step, moving a session. Next time I would prototype those moments first, because they decide whether someone is still training in month two."),
  ],
};
