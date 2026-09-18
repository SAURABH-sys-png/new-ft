import { Routes, Route } from 'react-router-dom';
import { Header } from './Layouts/Header';
import { ProtectedRoute } from './Layouts/ProtectedRoute';
import { Home } from './Routes/Home/Home';
import { BlogPost } from './Routes/Blog/BlogPost';
import { QBlogPost } from './Routes/Blog/QBlogPost';
import DefenseCalculator from './Routes/Calculator/calculator';
import { SStories } from './Routes/SStories/SStories';
import { StoryPost } from './Routes/SStories/StoryPost';
import { Login } from './Routes/TestSeries/Login';
import { Signup } from './Routes/TestSeries/Signup';
import { ForgotPassword } from './Routes/TestSeries/ForgotPassword';
import { ResetPassword } from './Routes/TestSeries/ResetPassword';
import { ExamsList } from './Routes/TestSeries/ExamsList';
import { TestsList } from './Routes/TestSeries/TestsList';
import { TestSession } from './Routes/TestSeries/TestSession';
import { TestComplete } from './Routes/TestSeries/TestComplete';

// Admin imports
import { AdminRoute } from './Routes/Admin/AdminRoute';
import { AdminLayout } from './Routes/Admin/AdminLayout';
import { AdminDashboard } from './Routes/Admin/AdminDashboard';
import { AdminExams } from './Routes/Admin/AdminExams';
import { AdminTests } from './Routes/Admin/AdminTests';
import { AdminQuestions } from './Routes/Admin/AdminQuestions';
import { AdminUsers } from './Routes/Admin/AdminUsers';

function App() {
  return (
    <div className="relative min-h-screen flex flex-col bg-blue-950">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/qblog/:id" element={<QBlogPost />} />
        <Route path="/calculator" element={<DefenseCalculator />} />
        <Route path="/sstories" element={<SStories />} />
        <Route path="/sstory/:id" element={<StoryPost />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected test series routes */}
        <Route path="/test-series" element={<ProtectedRoute><ExamsList /></ProtectedRoute>} />
        <Route path="/test-series/:examUuid" element={<ProtectedRoute><TestsList /></ProtectedRoute>} />
        <Route path="/test-series/:examUuid/:testUuid" element={<ProtectedRoute><TestSession /></ProtectedRoute>} />
        <Route path="/test-complete" element={<ProtectedRoute><TestComplete /></ProtectedRoute>} />
        
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
    </div>
  )
}

export default App
