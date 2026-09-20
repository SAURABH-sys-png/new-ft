import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './Layouts/Header';
import { Footer } from './Layouts/Footer';
import { ProtectedRoute } from './Layouts/ProtectedRoute';
import { PageTransition } from './components/ui/PageTransition';
import { Home } from './Routes/Home/Home';
import { BlogPost } from './Routes/Blog/BlogPost';
import { QBlogPost } from './Routes/Blog/QBlogPost';
import DefenseCalculator from './Routes/Calculator/calculator';
import { SStories } from './Routes/SStories/SStories';
import { StoryPost } from './Routes/SStories/StoryPost';
import { About } from './Routes/About/About';
import { NewsList } from './Routes/News/NewsList';
import { NewsArticle } from './Routes/News/NewsArticle';
import { Mocks } from './Routes/Mocks/Mocks';
import { SSBDocuments } from './Routes/SSBDocuments/SSBDocuments';
import WorkspaceDetail from './Routes/Workspace/WorkspaceDetail';
import { Login } from './Routes/TestSeries/Login';
import { Signup } from './Routes/TestSeries/Signup';
import { ForgotPassword } from './Routes/TestSeries/ForgotPassword';
import { ResetPassword } from './Routes/TestSeries/ResetPassword';
import { ExamsList } from './Routes/TestSeries/ExamsList';
import { TestsList } from './Routes/TestSeries/TestsList';
import { TestSession } from './Routes/TestSeries/TestSession';
import { TestComplete } from './Routes/TestSeries/TestComplete';
import { TestSeriesLayout } from './Routes/TestSeries/TestSeriesLayout';
import { Analytics } from './Routes/TestSeries/Analytics';
import { QuickRevision } from './Routes/TestSeries/QuickRevision';
import { Settings } from './Routes/TestSeries/Settings';

// Admin imports
import { AdminRoute } from './Routes/Admin/AdminRoute';
import { AdminLayout } from './Routes/Admin/AdminLayout';
import { AdminDashboard } from './Routes/Admin/AdminDashboard';
import { AdminExams } from './Routes/Admin/AdminExams';
import { AdminTests } from './Routes/Admin/AdminTests';
import { AdminQuestions } from './Routes/Admin/AdminQuestions';
import { AdminUsers } from './Routes/Admin/AdminUsers';

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      <Header />
      <PageTransition>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/qblog/:id" element={<QBlogPost />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/:id" element={<NewsArticle />} />
          <Route path="/mocks" element={<Mocks />} />
          <Route path="/ssb-documents" element={<SSBDocuments />} />
          <Route path="/calculator" element={<DefenseCalculator />} />
          <Route path="/sstories" element={<SStories />} />
          <Route path="/about" element={<About />} />
          <Route path="/sstory/:id" element={<StoryPost />} />
          <Route path="/workspace/:id" element={<WorkspaceDetail />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected test series routes */}
          <Route path="/test-series/*" element={
            <ProtectedRoute>
              <TestSeriesLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/test-series/explore" replace />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/explore" element={<ExamsList />} />
                  <Route path="/explore/:examUuid" element={<TestsList />} />
                  <Route path="/revision" element={<QuickRevision />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </TestSeriesLayout>
            </ProtectedRoute>
          } />
          <Route path="/test-session/:sessionId" element={<ProtectedRoute><TestSession /></ProtectedRoute>} />
          <Route path="/test-complete/:sessionId" element={<ProtectedRoute><TestComplete /></ProtectedRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/exams" element={<AdminExams />} />
                  <Route path="/tests" element={<AdminTests />} />
                  <Route path="/questions" element={<AdminQuestions />} />
                  <Route path="/users" element={<AdminUsers />} />
                </Routes>
              </AdminLayout>
            </AdminRoute>
          } />
        </Routes>
      </PageTransition>
      <Footer />
    </div>
  );
}

export default App;
