document.addEventListener('DOMContentLoaded', function() {
    // Get the project parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
  
    // Project data with corresponding slide indices
    const projects = {
      'crosswalk': {
        index: 0,
        title: 'Crosswalk Pedestrian Detection',
        category: 'AI & ML',
        // client: 'University Project',
        date: 'May 2024',
        url: 'https://github.com/raymardi27/Crosswalk-pedestrian-detection',
        description: 'A computer vision project that uses deep learning to detect pedestrians in crosswalks and alert drivers. The system processes real-time video feeds to identify potential hazards and triggers appropriate warning systems.',
        technologies: ['C++','ONNX', 'Nvidia Jetson Orin', 'OpenCV', 'YOLOv5']
      },
      'chess': {
        index: 1,
        title: 'Ajax Chess',
        category: 'Web Development',
        // client: 'University Project',
        date: 'December 2024',
        url: 'https://github.com/raymardi27/Ajax-Chess',
        description: 'A full-stack chess application built with Django and deployed on Google Cloud Platform. Features include real-time gameplay, move validation, and game state persistence.',
        technologies: ['Django', 'Python', 'JavaScript', 'GCP', 'Docker', 'PostgreSQL', 'Redis']
      },
      'voice-robot': {
        index: 2,
        title: 'Voice Activated Object Navigation Robot',
        category: 'AI & ML',
        // client: 'University Project',
        date: 'December 2024',
        url: 'https://github.com/get2aadil/robotics',
        description: 'An autonomous robot system that responds to voice commands for object navigation. Integrates speech recognition, obstacle avoidance, and path planning algorithms.',
        technologies: ['ROS', 'Python', 'TensorFlow', 'Speech Recognition']
      },
      'haullog': {
        index: 3,
        title: 'HaulLog - Logistics Management System',
        category: 'Web Development',
        // client: 'Enterprise Project',
        date: 'May 2024',
        url: 'https://github.com/get2aadil/trucking-management-1-1',
        description: 'A comprehensive logistics management system for tracking shipments, managing inventory, and optimizing delivery routes for small and medium enterprises.',
        technologies: ['Node.js', 'Express', 'MongoDB', 'React']
      },
    //   'autonomous-nav': {
    //     index: 4,
    //     title: 'Autonomous Navigation of a Humanoid Robot',
    //     category: 'AI & ML',
    //     // client: 'Research Project',
    //     date: 'May 2022',
    //     url: 'https://github.com/raymardi27/autonomous-nav',
    //     description: 'Implementation of advanced path planning algorithms for humanoid robot navigation in complex environments. Features real-time obstacle avoidance and dynamic path adjustment.',
    //     technologies: ['ROS', 'C++', 'Python', 'SLAM']
    //   }
    };
  
    // Function to update project details based on index
    function updateProjectDetails(index) {
      const project = Object.values(projects).find(p => p.index === index);
      if (project) {
        document.querySelector('.project-info h3').textContent = project.title;
        document.querySelector('.project-info ul').innerHTML = `
          <li><strong>Category</strong>: ${project.category}</li>
          <li><strong>Project date</strong>: ${project.date}</li>
          <li><strong>Project URL</strong>: <a href="${project.url}" target="_blank">${project.url}</a></li>
          <li><strong>Technologies</strong>: ${project.technologies.join(', ')}</li>
        `;
        document.querySelector('.project-description h2').textContent = project.title;
        document.querySelector('.project-description p').textContent = project.description;
      }
    }

    // <li><strong>Client</strong>: ${project.client}</li>
  
    // Initialize Swiper with callback
    const swiperElement = document.querySelector('.project-details-slider');
    const swiper = new Swiper(swiperElement, {
      loop: true,
      speed: 600,
    //   autoplay: {
    //     delay: 5000
    //   },
      slidesPerView: "auto",
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      on: {
        slideChange: function () {
          updateProjectDetails(this.realIndex);
        }
      }
    });
  
    // Set initial slide based on project ID
    if (projectId && projects[projectId]) {
      const targetIndex = projects[projectId].index;
      swiper.slideTo(targetIndex);
      updateProjectDetails(targetIndex);
    }
  });