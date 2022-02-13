<template>
  <div>
    <b-row>
      <b-col lg="12">
        <h4>File status</h4>
        <p>Process status of files uploaded</p>
      </b-col>
      <b-col lg="12">
        <b-table
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filter-included-fields="filterOn"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          stacked="md"
          show-empty
          small
          @filtered="onFiltered"
          :selectable="true"
          @row-clicked="rowClicked"
        >
          <template #cell(errors)="row">
            <!-- {{ row.value }} -->
            <div v-for="(err, i) in row.value" v-bind:key="i">
              {{ i + 1 }}. {{ err }}
            </div>
          </template>
          <template #cell(status)="row">
            <div v-if="row.value == 'On Hold'">
              <CBadge color="light" class="mr-1">On Hold</CBadge>
            </div>
            <div v-if="row.value == 'Failed'">
              <CBadge color="danger" class="mr-1">Failed</CBadge>
            </div>
            <div v-if="row.value == 'Processing'">
              <CBadge color="dark" class="mr-1">Processing</CBadge>
            </div>
            <div v-if="row.value == 'Finished'">
              <CBadge color="success" class="mr-1">Finished</CBadge>
            </div>
           
          </template>
        </b-table>
      </b-col>
      <b-col lg="12">
        <!-- User Interface controls -->
        <b-row>
          <b-col sm="5" md="6" class="my-1">
            <b-form-group
              label="Per page"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>

          <b-col sm="7" md="6" class="my-1">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="fill"
              size="sm"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: ["filesStatus"],
  data() {
    return {
      fields: [
        { key: "fileName", label: "File" },
        { key: "status", label: "Status", sortable: true }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [1, 5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: []
    };
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  computed: {
    items() {
      if (this.filesStatus != null) {
        return this.filesStatus;
      } else {
        return [];
      }
    }
  },
  methods: {
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rowClicked(item, index) {}
  }
};
</script>

<style lang="scss" scoped></style>
