<script setup>
// example components
import Navbar from "../../../components/Navbar.vue";
import Header from "../../../examples/Header.vue";

// sections
import Profile from "./Sections/AuthorProfile.vue";
import Posts from "./Sections/AuthorPosts.vue";

// image
import image from "@/assets/img/city-profile.jpg";
</script>
<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <Navbar
          :sticky="true"
          :action="{
            route: 'mailto:emma.louise.lane@pm.me',
            color: 'bg-gradient-success',
            label: 'Contact me!',
          }"
        />
      </div>
    </div>
  </div>

  <Header>
    <div
      class="page-header min-height-400"
      :style="{ backgroundImage: `url(${image})` }"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-8"></span>
    </div>
  </Header>
  <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6 mb-4">
    <Profile />
    <Posts />
  </div>
</template>
