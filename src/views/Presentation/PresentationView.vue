<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import Navbar from "../../components/Navbar.vue";
import Header from "../../examples/Header.vue";
import FilledInfoCard from "../../examples/cards/infoCards/FilledInfoCard.vue";

//Vue Material Kit 2 components
import MaterialSocialButton from "@/components/Material/MaterialSocialButton.vue";

// sections
//import data from "./Sections/Data/designBlocksData";
//import PresentationTestimonials from "./Sections/PresentationTestimonials.vue";

//images
import vueMkHeader from "@/assets/img/vue-mk-header.jpg";

//hooks
const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
});
onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");
});
</script>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <Navbar :sticky="true" />
      </div>
    </div>
  </div>
  <Header>
    <div
      class="page-header min-vh-100"
      :style="`background-image: url(${vueMkHeader})`"
      loading="lazy"
    >
      <div class="container">
        <div class="row">
          <div class="col-lg-7 text-center mx-auto position-relative">
            <h1
              class="text-white pt-3 mt-n5 me-2"
              :style="{ display: 'inline-block ' }"
            >
              Spark Lane Dev
            </h1>
            <p class="lead text-white px-5 mt-3" :style="{ fontWeight: '500' }">
              UNDER CONSTRUCTION
            </p>
          </div>
        </div>
      </div>
    </div>
  </Header>

  <!-- <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6">
    <PresentationTestimonials />
  </div> -->
</template>
