<template>
  <div class="map-container">
    <standard-header class="map-header" />
    <div class="map-body">
      <map-inspector
        :mapData="getDummyData()"
      />
    </div>
    <standard-footer class="map-footer" />
  </div>
</template>

<script>
import mapImage from '@/assets/images/maps/asylgad/asylgad-764-8k-min.jpg';
import dummyData from '@/assets/dummy-data/nodes';

import StandardFooter from '../../skeleton/StandardFooter';
import StandardHeader from '../../skeleton/StandardHeader';

import MapInspector from './MapInspector';

export default {
  components: {
    StandardHeader,
    StandardFooter,
    MapInspector,
  },

  data() {
    return {
      mapImage,
    };
  },

  methods: {
    getDummyData() {
      const map = this.$route.params.map;
      const region = this.$route.params.region;
      const location = this.$route.params.location;

      if (map) {
        if (region) {
          if (location) {
            return dummyData[map][region][location];
          }
          return dummyData[map][region];
        }
        return dummyData[map];
      }

      return dummyData.asylgad;
    },
  },
};
</script>

<style lang="scss" scoped>

.map-header {
  grid-area: header;
}

.map-body {
  grid-area: body;
  height: calc(100vh - #{$standard-header-height + $standard-footer-height});
  overflow: hidden;
}

.map-footer {
  grid-area: footer;
}

.map-container {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: $standard-header-height auto $standard-footer-height;
    grid-template-areas:
      "header"
      "body"
      "footer";
    transition: all 0.5s ease-in-out;
    overflow: hidden;
}

</style>
