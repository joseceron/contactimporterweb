<template>
  <div>
    <CCard>
      <CCardBody>
        <b-row>
        
          <b-col lg="12">
              <h4>Logs</h4>
              <p>This is the Log for the files processed</p>
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
                    {{i+1}}. {{err}}
                  </div>
                </template>           
                <template #cell(registered)="row">
                  <div v-if="row.value">
                    <CBadge color="success" class="mr-1">Yes</CBadge> 
                  </div>
                  <div v-else>
                      <CBadge color="danger" class="mr-1">No</CBadge> 
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
      </CCardBody>
    </CCard> 
  </div>
</template>

<script>
  export default {
    props: ['files'],
    data(){
      return {
        // items: [],
        fields: [
          { key: "fileName", label: "File" },
          { key: "name", label: "Name" },
          { key: "dof", label: "Date of Birth", sortable: true, sortDirection: "desc"},       
          { key: "phone", label: "Phone", sortable: true, sortDirection: "desc" },
          { key: "address", label: "Address", sortable: true },       
          { key: "credit_card", label: "Credit Card", sortable: true },       
          { key: "franchise", label: "Franchise", sortable: true },       
          { key: "email", label: "Email", sortable: true },               
          { key: "registered", label: "Registered", sortable: true },               
          { key: "errors", label: "Log", sortable: true },               
          
        ],
        totalRows: 1,
        currentPage: 1,
        perPage: 10,
        pageOptions: [1,5, 10, 15, { value: 100, text: "Show a lot" }],
        sortBy: "",
        sortDesc: false,
        sortDirection: "asc",
        filter: null,
        filterOn: [],
      }
    },    
    mounted() {
      // Set the initial number of items
      this.totalRows = this.items.length
    },
    computed: {
      items(){
        if(this.files!= null){
          let totalItems = []
          this.files.map(file => {
            let contacts = file.contacts
            contacts.map(contact => {
              contact.fileName = file.fileName
              totalItems.push(contact)
              if(contact.errors.length == 0) contact.registered = true
              else contact.registered = false
            })
            
          })
          return totalItems
        }else {
          return []
        }
      }
    },
    methods: {
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      rowClicked (item, index) {
        
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>