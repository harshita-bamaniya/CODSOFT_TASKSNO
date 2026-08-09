# CineMatch AI

### Discover Movies You'll Love.

CineMatch AI is a full-stack, portfolio-grade movie recommendation platform. It combines content-based filtering (TF-IDF plots, keywords, cast, and directors) with real-time user taste profiling and rating logs to generate personalized hybrid recommendation scores—running fully locally without expensive or paid APIs.

---

## 1. Overview
CineMatch AI is designed for software engineers and machine learning recruiters. The app simulates a premium SaaS product with a "Dark Cinematic + Modern Editorial" visual identity. It features a fast FastAPI backend and a responsive React client, showing that machine learning recommendations can be cleanly integrated into high-quality full-stack software.

## 2. Features
- **Instant Search & Discovery**: Debounced search and genre filtering across over 4,800 titles.
- **Dynamic Hybrid Recommendations**: Scoring is computed dynamically at the endpoint level, factoring in content similarity (60%), profile favorite genres (20%), and popularity/ratings (20%).
- **Cold-Start Taste Profiling**: First-time users are prompted to complete a light onboarding questionnaire, which immediately feeds their preferred genres, release eras, and minimum rating thresholds into the recommender engine.
- **Explainable Recommendations**: Every suggested movie displays a match percentage score and a generated explanation detailing why it was chosen.
- **Interactive Ratings & Watchlists**: Users can rate movies on a 1-5 scale and toggle bookmarks, with the application instantly updating their taste graphs and subsequent recommendation boards.
- **Local Persistence**: State is stored and synced inside the browser's `localStorage`.
- **"How It Works" Recruiter Visuals**: In-app documentation page detailing mathematical models, TF-IDF vectorization, and weight configuration vectors.

## 3. How It Works
The recommendation engine follows a structured machine learning pipeline:

```
[TMDB Movie Dataset] + [Credits Dataset]
                     ↓
[Data Preprocessing (extract directors, cast, genres, keywords)]
                     ↓
[Combined "Soup" Content Representation]
                     ↓
[TF-IDF Text Vectorization (fit_transform)]
                     ↓
[Cosine Pairwise Similarity Matrix (4800x4800)]
                     ↓
[User Profile Logs (favorite genres, ratings, eras)]
                     ↓
[Hybrid Recommendation Scorer & Ranker]
                     ↓
[Explainability Generation & Matching Feed]
```

## 4. Recommendation Algorithm
The hybrid score of a movie is calculated as:
$$\text{Score}(m) = w_{\text{sim}} \cdot S(m) + w_{\text{pref}} \cdot P(m) + w_{\text{pop}} \cdot U(m)$$

Where:
- $S(m)$ is the TF-IDF cosine similarity of the movie to the user's highly-rated movies or to a select query movie.
- $P(m)$ is the genre and release year alignment match with the user's taste profile.
- $U(m)$ is the normalized vote average and popularity score of the movie.
- $w_{\text{sim}} = 0.6$, $w_{\text{pref}} = 0.2$, $w_{\text{pop}} = 0.2$ (weights are fully configurable in the recommender engine).

## 5. Tech Stack
- **Frontend**: React, Vite, React Router, CSS Variables, Lucide React icons.
- **Backend**: Python 3, FastAPI, Uvicorn, Pydantic, Scikit-Learn, Pandas, NumPy, requests.
- **Testing**: PyTest, Starlette TestClient.

## 6. Architecture
```
cinematch-ai/
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, MovieCard, Onboarding, SkeletonCard
│   │   ├── pages/           # Home, Discover, MovieDetails, Recommendations, HowItWorks
│   │   ├── context/         # UserContext (state & localStorage sync)
│   │   ├── services/        # api.js client wrapper
│   │   ├── App.jsx          # Route handlers
│   │   ├── main.jsx         # Render mount
│   │   └── index.css        # Cinematic design system CSS
│   └── package.json
│
└── backend/
    ├── app/
    │   ├── api/
    │   ├── recommender/     # engine.py (ML vector similarity model)
    │   └── main.py          # FastAPI routes
    ├── scripts/             # preprocess.py (downloads and cleans CSV datasets)
    ├── tests/               # PyTest unit tests
    └── requirements.txt
```

## 7. Dataset
The platform utilizes the **TMDB 5000 Movie Dataset** (consisting of general movie metadata and credits). The datasets are downloaded and parsed automatically during the data phase.

## 8. Installation & Setup

### Prerequisites
- Python 3.9+ installed.
- Node.js (v18+) and npm installed.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the data preprocessing script to download datasets and compile vectors:
   ```bash
   python scripts/preprocess.py
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

## 9. API Documentation
All backend endpoints are documented and return predictable responses.

- `GET /api/health`: Returns API and dataset loading status.
- `GET /api/movies?page=1&limit=20&genre=`: Lists paginated movies (optionally filtered by genre).
- `GET /api/movies/search?q=`: Substring matches movies, ordered by popularity.
- `GET /api/movies/{movie_id}`: Retrieves individual movie metadata.
- `GET /api/movies/{movie_id}/recommendations`: Returns hybrid recommendations matching that specific movie ID.
- `POST /api/recommendations`: Processes user preferences, rating weights, and watch histories to output a ranked list of suggestions.
- `GET /api/trending`: Returns trending movies based on vote average and popularity scores.

## 10. Testing
Run the backend tests using PyTest:
```bash
cd backend
python -m pytest tests/
```

---

## 11. Limitations & Future Improvements
- **Collaborative Filtering**: The current engine is content-based due to running locally in a single-user sandbox. Incorporating user-item matrix factorization (e.g. ALS, SVD) when adding server-side databases is a logical next step.
- **Persistent DB**: State is currently persisted in the client's `localStorage` and sent in body payloads. Moving this to PostgreSQL or MongoDB on the backend would support production authentication.
- **Caching**: Pairing the recommendations endpoint with a Redis cache would increase throughput under heavy traffic loads.

---

## 12. Deployment
- **Backend**: Can be containerized with Docker and deployed to render.com, Google Cloud Run, or AWS ECS.
- **Frontend**: Can be built static (`npm run build`) and deployed to Vercel, Netlify, or GitHub Pages.

---

## 13. Author
Developed as a portfolio project showcasing Full-Stack Engineering, Machine Learning Pipelines, and UI/UX Design.
