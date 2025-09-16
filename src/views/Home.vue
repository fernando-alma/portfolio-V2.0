<template>
  <div class="home-page">
    <NavBar />
    <About />
    <Projects />
    <Education />
    <Contact />
    <Technologies />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import About from "@/components/About.vue";
import Projects from "@/components/InfiniteSlider.vue";
import Contact from "@/components/Contact.vue";
import Education from "@/components/Education.vue";
import Technologies from "@/components/Technologies.vue";

export default {
  name: "Home",
  components: {
    NavBar,
    About,
    Projects,
    Contact,
    Education,
    Technologies,
  }
}
</script>