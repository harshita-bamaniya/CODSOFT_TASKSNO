import React from 'react';
import { Database, Cpu, Activity, Settings, Eye, HelpCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem', maxWidth: '900px' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          padding: '0.75rem', 
          borderRadius: '50%', 
          background: 'rgba(34, 211, 238, 0.1)', 
          color: 'var(--color-accent-secondary)',
          marginBottom: '1rem'
        }}>
          <HelpCircle size={32} />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', fontFamily: 'var(--font-cinematic)' }}>
          Under the Hood: Recommendation Pipeline
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          CineMatch AI runs a local content-based hybrid recommendation system built using Scikit-Learn.
        </p>
      </header>

      {/* Visual Workflow Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Step 1 */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '60px 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-accent-primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>1. Data Preprocessing & Merging</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              We merge the TMDB 5000 Movies metadata with Cast and Crew credits. Complex JSON columns are parsed to extract clean lists of genres, keywords, directors, and the top-3 starring actors.
            </p>
            <pre style={{ background: 'var(--color-secondary)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.8rem', color: '#94a3b8' }}>
{`# Extracting director and keywords
df['director'] = df['crew'].apply(get_director)
df['genres_list'] = df['genres'].apply(get_list)`}
            </pre>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '60px 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--color-accent-secondary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>2. Text Combination & TF-IDF Vectorization</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              To compute content similarity, we concatenate the movie's overview, genres, keywords, cast, and director into a unified metadata text representation (a "metadata soup"). We fit a Term Frequency-Inverse Document Frequency (TF-IDF) vectorizer on this soup to transform text into numerical vectors.
            </p>
            <pre style={{ background: 'var(--color-secondary)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.8rem', color: '#94a3b8' }}>
{`vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(df['soup'])`}
            </pre>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '60px 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--color-accent-secondary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>3. Cosine Similarity Calculations</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              We compute the pairwise cosine similarity between all movie vectors in the TF-IDF matrix. Cosine similarity calculates the cosine of the angle between two multi-dimensional vectors, measuring how closely their topics and crew overlap.
            </p>
            <div style={{ background: 'var(--color-secondary)', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px', fontFamily: 'var(--font-cinematic)', fontSize: '1.15rem' }}>
              Cosine Similarity (A, B) = (A • B) / (||A|| * ||B||)
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '60px 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-accent-primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>4. Hybrid Scoring & Personalized Filtering</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              When a user requests recommendations, we combine three distinct signals into a single score: content similarity to their high-rated/watched movies (60%), genre/era preference matching from their taste profile (20%), and movie rating/popularity signals (20%).
            </p>
            <pre style={{ background: 'var(--color-secondary)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.8rem', color: '#94a3b8' }}>
{`hybrid_score = (0.6 * content_similarity) + (0.2 * preference_score) + (0.2 * popularity_score)`}
            </pre>
          </div>
        </div>

        {/* Step 5 */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '60px 1fr', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--color-accent-secondary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>5. Explainability Generation</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Finally, we analyze the metadata of the recommended movies against the source movies or user profile to determine *why* they matched (e.g. sharing the same director, keywords, or fitting favorite genres) and render the corresponding text for the user.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;
