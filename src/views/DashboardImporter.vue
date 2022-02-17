<template>
  <div>
    <b-row>
      <b-col lg="6">
        <b-row>
          <b-col lg="12">
            <h4>1. Pick up a file</h4>
            <input type="file" accept=".csv" @change="pick" />
          </b-col>
        </b-row>
      </b-col>
      <b-col lg="6">
        <b-row v-if="file != null && isValidFormat">
          <b-col lg="12">
            <h4>2. Match your colums value</h4>
            <p>
              Match the personalized columns names of your file with a specific
              listed name
            </p>
          </b-col>

          <b-col lg="8">
            <div v-for="(header, i) in headerFile" v-bind:key="i">
              <b-row>
                <b-col lg="5">
                  <strong>{{ i + 1 }} {{ header.label }}</strong>
                </b-col>
                <b-col lg="7">
                  <v-select
                    v-model="header.value"
                    :options="headerRef"
                    placeholder="Select the coincidence"
                  >
                  </v-select>
                </b-col>
              </b-row>
            </div>
          </b-col>
          <b-col lg="12">
            <b-button
              class="btn-info"
              @click="setHeaderOrder"
              v-if="file != null"
            >
              set header order
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <hr />

    <b-row v-if="flagSave">
      <b-col lg="6">
        <h4>3. Send the contacts or add another file</h4>
        <p>You can add more files in step 1 to process them in one try</p>
        <b-button class="btn-info" @click="loadFile">
          save contacts
        </b-button>
      </b-col>
    </b-row>

    <b-row>
      <!-- <b-col lang="6">
        Payload: {{ payload }}
      </b-col> -->
      <!-- <b-col lang="6">
        Items: {{ items }}
      </b-col> -->
    </b-row>
    <br />
    <b-row>
      <b-col lg="4" v-if="filesStatus.length > 0">
        <CCard>
          <CCardBody>
            <FilesStatus :filesStatus="filesStatus" />
          </CCardBody>
        </CCard>
      </b-col>

      <b-col lg="8" v-if="items.length > 0">
        <CCard>
          <CCardBody>
            <b-row>
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
                >
                  <template #cell(name)="row">
                    {{ row.value }}
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
          </CCardBody>
        </CCard>
      </b-col>
    </b-row>

    <!-- Table Log -->
    <section v-if="files != null">
      <TableLog :files="files" />
    </section>
    <!-- filesStatus: {{ filesStatus }} -->
  </div>
</template>

<script>
import TableLog from "../views/pages/TableLog";
import FilesStatus from "../views/pages/FilesStatus";
export default {
  name: "dashboardImporter",
  components: { TableLog, FilesStatus },
  data() {
    return {
      file: null,
      fd: null,
      payload: [],
      userToken: null,
      items: [],
      fields: [
        { key: "name", label: "Name" },
        {
          key: "dof",
          label: "Date of Birth",
          sortable: true,
          sortDirection: "desc"
        },
        { key: "phone", label: "Phone", sortable: true, sortDirection: "desc" },
        { key: "address", label: "Address", sortable: true },
        { key: "credit_card", label: "Credit Card", sortable: true },
        { key: "franchise", label: "Franchise", sortable: true },
        { key: "email", label: "Email", sortable: true }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [1, 5, 10, 15, { value: 100, text: "Show a lot" }],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      files: null,

      headerRef: [
        { value: "name", label: "Name" },
        { value: "dof", label: "Date of birth" },
        { value: "phone", label: "Phone" },
        { value: "address", label: "address" },
        { value: "credit_card", label: "Credit Card Number" },
        { value: "email", label: "Email" }
      ],
      headerFile: [],
      filesStatus: [],
      isValidFormat: false,
      progress: 0
    };
  },
  created() {
    const currentUser = this.$firebase.auth().currentUser;
    this.userToken = currentUser ? currentUser.uid : "";
    this.loadContacts();
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  computed: {
    flagSave() {
      if (this.payload.length > 0) return true;
      else return false;
    }
  },
  methods: {
    pick(evt) {
      this.headerFile = [];
      this.file = evt.target.files[0];

      if (!this.file) {
        return;
      }

      let fileFound = this.filesStatus.find(
        fileStatus => fileStatus.fileName == this.file.name
      );

      if (fileFound) {
        alert("This file has already been uploaded");
        return;
      } else {
        this.filesStatus.push({
          fileName: this.file.name,
          status: "On Hold"
        });

        const reader = new FileReader();
        reader.onload = e => {
          const target = e.target;
          const result = target.result;
          let item = {
            fileName: this.file.name,
            contacts: result,
            userToken: this.userToken
          };
          this.file = item;
          this.validateFiles(item);

        };
        reader.readAsText(this.file);
      }
    },
    validateFiles(file) {
      let contacts = file.contacts;
      let url = "http://localhost:3000/validateContacts";
      let body = { contacts };
      let bodyS = JSON.stringify(body);

      this.$http
        .post(url, bodyS, { headers: {} })
        .then(response => {
          if (response.status == 200) {
            this.isValidFormat = true;
            let body = response.body;
            body.map(header => {
              let item = {
                label: header,
                value: null
              };
              this.headerFile.push(item);
            });
          } else if(response.status == 204){            
            alert('There is no content in the file: ' + file.fileName)
            this.isValidFormat = false;
            this.isValidFormat = false;
            let fileStatusItem = this.filesStatus.find(
              item => item.fileName == file.fileName
            );
            fileStatusItem.status = "On Hold";
          }
        })
        .catch(e => {          
          alert(e.body)
          this.isValidFormat = false;
          let fileStatusItem = this.filesStatus.find(
            item => item.fileName == file.fileName
          );
          fileStatusItem.status = "Failed";
        });
    },
    setHeaderOrder() {
      let headers = [];
      this.headerFile.map(item => {
        headers.push(item.value.value);
      });
      this.file.headers = headers;
      this.payload.push(this.file);
      this.file = null;
    },
    loadFile() {
      this.files = null;
      let url = "http://localhost:3000/contacts";
      let body = {
        files: this.payload, 
        userToken: this.userToken       
      };            
      this.setProgressFiles();

      let bodyS = JSON.stringify(body);
      this.$http
        .post(url, body, {
          progress: e => {
            this.progress = (e.loaded / e.total) * 100;
          }
        })
        .then(response => {
          if (response.status == 200) {
            let body = response.body;            
            this.files = body.files;
            this.setFilesStatus();
            this.items = [];
            let storagedContacts = body.storagedContacts;
            storagedContacts.map(contact => {
              this.items.push(contact);
            });
            this.totalRows = this.items.length;
          } else {
            console.log("Err2: ", response);
          }
        })
        .catch(error => {
          console.log("Err3: ", error);
        });
    },
    setFilesStatus() {
      this.files.map(file => {
        let fileStatusItem = this.filesStatus.find(
          item => item.fileName == file.fileName
        );
        if (fileStatusItem) fileStatusItem.status = file.status;
      });
    },
    setProgressFiles() {
      this.payload.map(itemPayload => {
        let fileStatusFound = this.filesStatus.find(
          fileStatus => fileStatus.fileName == itemPayload.fileName
        );
        if (fileStatusFound) fileStatusFound.status = "Processing";
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    loadContacts() {
      let url = "http://localhost:3000/getContacts";
      let body = {}
      let options = {
        body: JSON.stringify(body),
        headers: {
            Authorization: this.userToken
        }
      }
      this.$http
        .get(url, options)
        .then(response => {
          if (response.status == 200) {
            let body = response.body
            this.items = body.items
          } else {
            console.log("Err4: ", response);
          }
        })
        .catch(error => {
          alert(error.body.error)          
        });     
    }
  }
};
</script>

<style lang="scss" scoped></style>
