# Jackall Creative AI + Creative Company Website Rebuild Plan

## Project objective

Rebuild Jackall Creative from a Squarespace site into a Cloudflare-hosted website that positions the company as an AI expert and creative partner for growing businesses.

The new site should preserve the approachable “jack of all trades” creative-department value while making AI education, AI consulting, and AI-enabled marketing systems the new lead offer.

## Strategic positioning

### Recommended brand promise

**Jackall Creative helps growing businesses use AI with confidence, then turns that strategy into better marketing, websites, content, and creative systems.**

### Recommended one-line homepage headline

**AI strategy meets creative execution for businesses that need momentum.**

### Recommended supporting headline

Jackall Creative combines AI education, workflow consulting, web development, brand messaging, photography, video, and marketing support so your team can work smarter without hiring an entire in-house creative department.

### Recommended brand pillars

1. **AI made practical** — not hype, not jargon; training and workflows that fit the way the client already works.
2. **Creative work that ships** — brand, web, content, proposals, photo, and video built to support real business goals.
3. **An affordable creative department** — flexible support for companies that need senior creative thinking without full-time overhead.
4. **Local trust, modern capability** — keep the Iowa/regional client credibility while presenting an up-to-date AI and digital consulting offer.

## Recommended audience focus

### Primary audiences

- Small and mid-sized businesses that cannot justify hiring a full internal creative/marketing department.
- Construction, architecture, commercial real estate, professional services, and local/regional businesses.
- Founders and new companies that need brand, website, operations, and AI workflow foundations.
- Existing businesses with marketing backlog, outdated websites, disconnected tools, or unclear AI adoption plans.

### Buyer pain points to address

- “We know AI matters, but we do not know where to start.”
- “Our team wastes time on repeatable content, documents, and admin workflows.”
- “Our website and marketing materials do not reflect where the company is going.”
- “We need creative output, but we cannot hire a full department.”
- “We have plenty of ideas, but no system for prioritizing and shipping them.”

## Recommended service architecture

### 1. AI Education & Readiness

- AI fundamentals for business owners and teams
- Prompting and safe usage training
- AI policy and adoption guidance
- Role-specific workshops
- AI opportunity audit

### 2. AI Workflow Consulting

- Workflow mapping
- Content and document automation planning
- CRM and tool integration strategy
- Internal knowledge-base strategy
- Repeatable prompt/system design
- SOP and process documentation

### 3. AI-Powered Creative Systems

- Social media content systems
- Proposal and presentation systems
- Brand voice and messaging libraries
- Blog/newsletter workflows
- Photo/video asset reuse plans
- Reusable templates for recurring marketing tasks

### 4. Websites & Cloudflare Builds

- Website strategy and page architecture
- Static website builds for Cloudflare Pages
- Landing pages and campaign pages
- Analytics and conversion tracking
- Migration away from Squarespace where appropriate
- Performance and SEO baseline setup

### 5. Brand, Marketing & Visual Media

- Brand identity and positioning
- Print and document design
- Photography and videography
- Architecture, construction, commercial real estate, headshots, product, and local business visuals
- B-roll libraries and social media video assets

### 6. Extended Creative Department

- Minimum three-month engagement
- Prioritized backlog planning
- Monthly creative/marketing production
- AI workflow improvement over time
- Strategy, production, and implementation in one relationship

## Proposed website structure

### Home

Purpose: quickly communicate the repositioning and route visitors to AI consulting, creative services, and proof.

Recommended sections:

1. Hero with AI + creative positioning
2. “What we help you do” outcome cards
3. AI education/workflow consulting feature section
4. Creative department feature section
5. Selected work / proof grid
6. Engagement models: project, workshop, extended support
7. Lead magnet callout
8. Contact call to action

### AI Consulting

Purpose: establish authority around AI and make the offer tangible.

Recommended sections:

- AI readiness audit
- Workshops and training
- Workflow consulting
- AI content systems
- Responsible-use guidance
- Example deliverables
- CTA: schedule an AI opportunity call

### Creative Services

Purpose: reorganize current services without overwhelming the visitor.

Recommended sections:

- Brand and marketing
- Websites
- Photography
- Video
- Documents, proposals, templates
- CRM and analytics support

### Work / Case Studies

Purpose: preserve current credibility and add a cleaner case-study format.

Recommended case-study template:

- Client / industry
- Challenge
- Services provided
- Outcome
- Assets delivered
- Images/video
- Related service CTA

### Photography & Video

Purpose: keep image-rich portfolio content but make it easier to scan.

Recommended categories:

- Architecture and commercial real estate
- Construction progress and transformation
- Headshots and portraits
- Product and local business branding
- Video profiles and social assets

### Work With Us

Purpose: explain engagement models and convert visitors.

Recommended engagement models:

- AI Workshop / Training Sprint
- One-time Project
- Extended Creative Department
- Website Migration / Cloudflare Build

### Resources

Purpose: replace or reorganize “Our Blog” into authority-building content.

Recommended content types:

- AI for small business guides
- Creative operations checklists
- Website planning resources
- Case-study breakdowns
- Downloadable checklists and calculators

### Contact

Purpose: frictionless lead capture.

Recommended fields:

- Name
- Email
- Company
- Website
- What do you need help with?
- Timeline
- Budget range
- Consent to receive reply

## Design concepts

### Concept A: Practical AI Creative Department

- Best fit for Jackall Creative’s current approachable tone.
- Visual direction: clean editorial layout, confident typography, warm neutrals, black/charcoal, white, and a single electric accent.
- Use photos from current portfolio as proof, with subtle AI-pattern overlays.
- Tone: smart, grounded, local, practical.

### Concept B: Modern Boutique AI Consultancy

- Best fit if the goal is to appear more premium and expert-led.
- Visual direction: dark interface sections, gradient mesh accents, card-based service architecture, technical diagrams, motion-lite interactions.
- Use fewer images on the homepage; emphasize frameworks and outcomes.
- Tone: strategic, precise, future-facing.

### Concept C: Creative Studio + Systems Lab

- Best fit if the company wants to stay highly creative while introducing AI.
- Visual direction: bold type, layered portfolio images, visible process diagrams, dynamic content blocks, AI-generated abstract texture system.
- Tone: inventive, energetic, multidisciplinary.

### Recommended direction

Use **Concept A** as the foundation with selected pieces of **Concept B**. This preserves the current trust and creative breadth while making the AI consulting shift feel credible and modern.

## Messaging migration map

| Current message | Updated message |
| --- | --- |
| Jackall Creative provides AI education and consulting combined with creative marketing. | AI strategy meets creative execution for businesses that need momentum. |
| Jack of all trades / broad service range. | A flexible AI-enabled creative department for growing businesses. |
| Too many companies cannot hire in-house creative departments. | Get senior creative, AI workflow, and web support without the overhead of a full internal team. |
| Websites are your other location. | Your website should be fast, clear, AI-era ready, and inexpensive to host. |
| Extended services save money versus hiring internally. | Extended support gives you a prioritized creative and AI roadmap, then helps ship the work month by month. |

## Cloudflare build recommendation

### Recommended stack

- Static site generated with Astro or plain HTML/CSS if maximum simplicity is preferred.
- Cloudflare Pages for hosting.
- Cloudflare Forms alternative via form-to-email service, Cloudflare Workers, or a serverless form endpoint.
- Cloudflare Web Analytics or privacy-friendly analytics.
- Image assets optimized to WebP/AVIF.
- No Squarespace dependency.

### Proposed final folder structure

```text
website/
  package.json
  astro.config.mjs
  public/
    assets/
    favicon.svg
    robots.txt
  src/
    content/
    layouts/
    pages/
    styles/
    components/
```

### Deployment target

- Build command: `npm run build`
- Output directory: `dist`
- Cloudflare Pages project connected to the repository branch.

## Implementation phases

### Phase 1 — Content and asset extraction

- Capture current page copy.
- Export/download current images and documents from Squarespace.
- Identify best portfolio images and compress for web.
- Decide which blog/resource content to keep.

### Phase 2 — Information architecture and copy

- Approve sitemap.
- Approve service categories.
- Rewrite homepage and service pages.
- Draft CTAs and lead magnets.

### Phase 3 — Visual design system

- Approve design concept.
- Define type scale, color palette, spacing, buttons, cards, image treatments, and reusable sections.
- Create mobile-first layout plan.

### Phase 4 — Static build

- Build Cloudflare-ready website files.
- Add SEO metadata, Open Graph images, robots.txt, sitemap.xml, and analytics.
- Add accessible navigation and contact forms.

### Phase 5 — QA and launch

- Test responsive layouts.
- Run Lighthouse/performance checks.
- Validate forms.
- Configure Cloudflare Pages.
- Update DNS from Squarespace hosting to Cloudflare.
- Monitor launch.

## Key approval decisions needed

1. Which design concept should lead: A, B, or C?
2. Should the new website be one-page first or multi-page from launch?
3. Which AI services are currently real and ready to sell?
4. Which current portfolio projects should be featured first?
5. Should pricing ranges be public, hidden, or packaged as “starting at” offers?
6. What contact form destination should be used after moving away from Squarespace?
