import React from "react";
import { useNavigate } from "react-router-dom";
import CustomNavbar from '../components/WellcomePage/Navbar';
import Slideshow from '../components/WellcomePage/Slideshow';
import ShowKhoaHoc from '../components/WellcomePage/ShowKhoaHoc';
import { useCourses,useGiaoVienData } from '../Hooks/WellcomPageHook';
import GioiThieu from "../components/WellcomePage/GioiThieu";
import Footer from '../components/WellcomePage/Footer';

function WelcomePage() {
    const navigate = useNavigate();
    
    // Sử dụng custom hook để fetch data
    const { courses, loading, error, refetchCourses } = useCourses();
   const { giaoVien, loading: giaoVienLoading, error: giaoVienError } = useGiaoVienData();
    return (
        <div>
            <CustomNavbar navigate={navigate}
            courses={courses} />
            <Slideshow navigate={navigate} />
            
            <ShowKhoaHoc 
                courses={courses}
                loading={loading}
                error={error}
                navigate={navigate}
                onRefresh={refetchCourses}
            />
           <GioiThieu 
                giaoVien={giaoVien} 
                loading={giaoVienLoading}
                error={giaoVienError}
            />
            <Footer />
        </div>
    );
}

export default WelcomePage;