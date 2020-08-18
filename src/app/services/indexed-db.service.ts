import { Injectable } from "@angular/core";
import { allProducts } from "src/products/allProducts";
@Injectable({
  providedIn: "root",
})
export class IndexedDBService {
  private request;
  dbName: string = "";
  version: number = 0;
  collectionName: string = "";
  allProd = allProducts;
  //==========
  imageDb = "";
  imageVersion = 0;
  imageCollection = "";

  constructor() {
    this.dbName = "MyTestDatabase";
    this.version = 7;
    this.collectionName = "customers";
    this.imageDb = "store";
    this.imageVersion = 2;
    this.imageCollection = "info";
    // This is what our customer data looks like.
    const customerData = [
      { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
      { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" },
    ];
    //================================
    // initialize indexedDb
    //================================
    this.request = indexedDB.open("MyTestDatabase", 7);
    //================================
    // if error indexedDb
    //================================
    this.request.onerror = function (event) {
      console.log("Version mismatch! exiting version is higher then requested");
    };
    //================================
    // on success indexedDb
    //================================
    this.request.onsuccess = function (event) {
      let db = event.target.result;
      //console.log(db);
    };
    //================================
    // exiting old version upgrade indexedDb
    // with the newer version
    //================================
    // This event is only implemented in recent browsers
    this.request.onupgradeneeded = function (event) {
      var db = event.target.result;

      // Create an objectStore to hold information about our customers. We're
      // going to use "ssn" as our key path because it's guaranteed to be
      // unique - or at least that's what I was told during the kickoff meeting.
      var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

      // // Create an index to search customers by name. We may have duplicates
      // // so we can't use a unique index.
      // objectStore.createIndex("name", "name", { unique: false });

      // Create an index to search customers by email. We want to ensure that
      // no two customers have the same email, so use a unique index.
      objectStore.createIndex("email", "email", { unique: true });

      // Use transaction oncomplete to make sure the objectStore creation is
      // finished before adding data into it.
      objectStore.transaction.oncomplete = function (event) {
        // Store values in the newly created objectStore.
        var customerObjectStore = db
          .transaction("customers", "readwrite")
          .objectStore("customers");
        customerData.forEach(function (customer) {
          customerObjectStore.add(customer);
        });
      };

      objectStore.transaction.onerror = function (event) {
        console.log("error occured in data storing transaction");
      };
    };
  }

  //============== get single data from collection==============
  getExitingData(
    dbName: string,
    version: number,
    collectioName: string,
    id: any
  ) {
    let request = indexedDB.open(dbName, version);
    request.onsuccess = function (event) {
      var db = request.result;
      var transaction = db.transaction([collectioName], "readwrite");
      let objectStoreRequest = transaction.objectStore(collectioName).get(id);
      objectStoreRequest.onsuccess = function (event) {
        // console.log(
        //   "Name for SSN 444-44-4444 is " + objectStoreRequest.result.name
        // );
      };
    };
  }

  //============== update data in collection==============
  updateExistingData(
    dbName: string,
    version: number,
    collectioName: string,
    id: any,
    obj: any,
    value: any
  ) {
    var request = indexedDB.open(dbName, version);

    request.onsuccess = function (event) {
      const db = request.result;
      const objStore = db
        .transaction([collectioName], "readwrite")
        .objectStore(collectioName);
      const requestTran = objStore.get(id);
      requestTran.onsuccess = function () {
        var data = requestTran.result;
        data[obj] = value;
        const requestUpdate = objStore.put(data);

        requestTran.onsuccess = function () {
          console.log("this data is updated");
          this.getExitingData(dbName, version, collectioName, id);
        }.bind(this);
      };
    };
  }

  //============== delete single data in collection==============
  deleteExistingData(
    dbName: string,
    version: number,
    collectioName: string,
    id: any
  ) {
    var request = indexedDB.open(dbName, version);
    request.onsuccess = function (event) {
      var db = request.result;
      var request = db
        .transaction([collectioName], "readwrite")
        .objectStore(collectioName)
        .delete(id);
      request.onsuccess = function (event) {
        console.log("data is deleted");
      };
    };
  }

  //====================clear full collection==============
  clearFullCollection(dbName: string, version: number, collectioName: string) {
    var request = indexedDB.open(dbName, version);

    request.onsuccess = function (event) {
      const db = request.result;
      const objStore = db
        .transaction([collectioName], "readwrite")
        .objectStore(collectioName);
      const objClearRequest = objStore.clear();
      objClearRequest.onsuccess = function () {
        console.log("full collection is cleared");
        this.getAllFromCollection(dbName, version, collectioName);
      }.bind(this);
    };
  }
  //====================get full collection==============
  getAllFromCollection(dbName: string, version: number, collectioName: string) {
    var request = indexedDB.open(dbName, version);

    request.onsuccess = function (event) {
      const db = request.result;
      const objStore = db
        .transaction([collectioName], "readwrite")
        .objectStore(collectioName);
      const objGetAllRequest = objStore.getAll();
      objGetAllRequest.onsuccess = function () {
        console.log(
          "full collection is cleared",
          JSON.stringify(objGetAllRequest.result)
        );
        console.log("full collection is cleared", objGetAllRequest.result);
        return objGetAllRequest.result;
      };
    };
  }
}
