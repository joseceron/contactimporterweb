<template>
  <div>
    <b-row>    
      <b-col lg="4" offset-lg="4">
        <input type="file" accept=".csv" @change="pick" />
      </b-col>
    </b-row>

    <br>
      
    <b-row>
      <b-col lg="2" offset-lg="4" v-if="file">
        <h5>File loaded!</h5>
      </b-col>
      <b-col lg="2" v-if="file">
        <b-button class="btn-info" @click="loadFile">
          save contacts
        </b-button>
      </b-col>
       
    </b-row>

    <b-row>
      <b-col lang="6">
        {{ payload }}
      </b-col>
      <b-col lang="6">
        Items: {{ items }}
      </b-col>
    </b-row>

    <b-row v-if="items.length > 0">
      <b-col lg="12">
        <h4>My contacs</h4>
        <p>This is the list of all contacts that are storaged</p>
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
            <template #cell(name)="row">
                {{ row.value }}
                <!-- {{ row.value.first }} {{ row.value.last }} -->
            </template>

            <template #cell(actions)="row">
                <!-- <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">Registrar pago</b-button> -->
                <b-button size="sm" @click="rowClicked(row.item, row.index, $event.target)" class="mr-1">Registrar pago</b-button>
                <b-button
                size="sm"
                @click="row.toggleDetails"
                >{{ row.detailsShowing ? 'Ocultar' : 'Ver' }} Detalle</b-button>
            </template>

            <template #row-details="row">
                <b-card>
                <b-row>                    
                    <b-col lg="12" md="12">
                        <div>
                            <strong>Id:</strong>
                            {{ row.item.id }}
                        </div>                       
                    </b-col>
                </b-row>
                </b-card>
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

    <!-- Table Log -->
    <section v-if="files != null ">
      <TableLog :files="files"/>
    </section>
  </div>
</template>

<script>
import TableLog from '../views/pages/TableLog'
export default {
  name: "dashboardImporter",
  components: {TableLog},
  data() {
    return {
      file: null,
      payload: [],
      userToken: null,
      items: [],
      fields: [
        { key: "name", label: "Name" },
        { key: "dof", label: "Date of Birth", sortable: true, sortDirection: "desc"},       
        { key: "phone", label: "Phone", sortable: true, sortDirection: "desc" },
        { key: "address", label: "Address", sortable: true },       
        { key: "credit_card", label: "Credit Card", sortable: true },       
        { key: "franchise", label: "Franchise", sortable: true },       
        { key: "email", label: "Email", sortable: true },               
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
      files: null
    };
  },
  created(){
    const currentUser = this.$firebase.auth().currentUser
    this.userToken = currentUser ? currentUser.uid : "";
    console.log('userToken: ', this.userToken)
  },
  mounted() {
      // Set the initial number of items
      this.totalRows = this.items.length
  },
  methods: {
    pick(evt) {
      this.file = evt.target.files[0];
      if (!this.file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        const target = e.target;
        const result = target.result;
        // console.log(JSON.stringify(result))
        this.payload.push({
          fileName: this.file.name,
          contacts: result,
          userToken: this.userToken
        });
      };
      reader.readAsText(this.file);
    },
    loadFile() {
      let url = "http://localhost:3000/contacts";
      let body = {
        files: this.payload
      };
      let bodyS = JSON.stringify(body);
      this.$http
        .post(url, bodyS, { headers: {} })
        .then(response => {
          
          if(response.status == 200){
            let body = response.body
            console.log(body)
            this.files = body.files
            let storagedContacts = body.storagedContacts
            storagedContacts.map(contact=>{
              this.items.push(contact)
            })
            this.totalRows = this.items.length
            
          }else{            
            console.log('Error: ', response)
          }
        })
        .catch(e => {
          console.log(e);
        })
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rowClicked (item, index) {
      
    },
  }
};
</script>

<style lang="scss" scoped></style>
