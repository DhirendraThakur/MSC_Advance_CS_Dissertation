import Sidebar from "../components/Sidebar";

function RecommendationPage({ currentUser, onLogout }) {
  return (
    <div className="app">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="main">
        <section className="card recommendation">
          <div className="section-header">
            <div>
              <h2>Framework Recommendation Model Preview</h2>

              <p>
                This preview represents the dissertation’s decision-support
                contribution.
              </p>
            </div>
          </div>

          <div className="recommendation-grid">
            <div className="requirement-box">
              <h3>Project Requirements</h3>

              <p>Project size: Large</p>
              <p>Maintainability priority: High</p>
              <p>AI integration requirement: High</p>
              <p>Security priority: High</p>
              <p>Development time: Medium</p>
            </div>

            <div>
              <div className="score">
                <span>Angular</span>
                <div>
                  <strong style={{ width: "84%" }}></strong>
                </div>
                <b>84%</b>
              </div>

              <div className="score">
                <span>React</span>
                <div>
                  <strong style={{ width: "76%" }}></strong>
                </div>
                <b>76%</b>
              </div>

              <div className="score">
                <span>Vue.js</span>
                <div>
                  <strong style={{ width: "71%" }}></strong>
                </div>
                <b>71%</b>
              </div>

              <p className="explanation">
                Example explanation: Angular is recommended where
                maintainability, scalability, security, and structured
                development are high priorities. The final model will calculate
                these scores using evaluation evidence from all three framework
                prototypes.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RecommendationPage;