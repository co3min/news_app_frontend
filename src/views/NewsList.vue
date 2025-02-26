<template>
  <div class="container mx-auto p-6">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
      Știri de ultima oră
    </h1>

    <div class="flex flex-wrap justify-between mb-6">
      <div class="flex space-x-4 mb-4">
        <input
          v-model="query"
          type="text"
          placeholder="Caută știri..."
          class="border p-3 rounded-md text-gray-700 w-64" />
        <select
          v-model="selectedSource"
          class="border p-3 rounded-md text-gray-700">
          <option value="">Selectează sursa</option>
          <option value="Digi24">Digi24</option>
          <option value="Hotnews">Hotnews</option>
        </select>
        <button
          @click="fetchNewsSearch"
          class="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition">
          Caută
        </button>
      </div>

      <div class="flex space-x-4 mb-4">
        <select v-model="sortBy" class="border p-3 rounded-md text-gray-700">
          <option value="">Fără sortare</option>
          <option value="publishedDate">Dată</option>
        </select>
        <select v-model="sortOrder" class="border p-3 rounded-md text-gray-700">
          <option value=""></option>
          <option value="desc">Descrescător</option>
          <option value="asc">Crescător</option>
        </select>
        <button
          @click="applySorting"
          class="bg-green-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-700 transition">
          Aplică sortarea
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table
        class="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="py-3 px-4 text-lg font-semibold text-gray-700">Titlu</th>
            <th class="py-3 px-4 text-lg font-semibold text-gray-700">Sursă</th>
            <th class="py-3 px-4 text-lg font-semibold text-gray-700">Link</th>
            <th class="py-3 px-4 text-lg font-semibold text-gray-700">Dată</th>
          </tr>
        </thead>
        <tbody v-if="newsList.length > 0">
          <tr
            v-for="news in newsList"
            :key="news.id"
            class="border-t border-gray-200 hover:bg-gray-50 transition">
            <td class="py-3 px-4">{{ news.title }}</td>
            <td class="py-3 px-4">{{ news.source }}</td>
            <td class="py-3 px-4">
              <a
                :href="news.link"
                target="_blank"
                class="text-blue-500 hover:underline">
                Accesează link
              </a>
            </td>
            <td class="py-3 px-4">{{ formatDate(news.publishedDate) }}</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="text-center py-4 text-gray-600">
              Nu sunt știri disponibile.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { format } from "date-fns";

export default {
  data() {
    return {
      newsList: [],
      query: "",
      selectedSource: "",
      sortBy: "",
      sortOrder: "",
    };
  },
  methods: {
    fetchNews() {
      axios
        .get("http://localhost:8080/api/news")
        .then((response) => {
          console.log(response.data);
          this.newsList = response.data;
        })
        .catch((error) => {
          console.error("Error loading news:", error);
        });
    },
    fetchNewsSearch() {
      let url = "http://localhost:8080/api/search";
      let params = [];
      if (this.query) params.push(`keyword=${this.query}`);
      if (this.selectedSource) params.push(`source=${this.selectedSource}`);

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      axios
        .get(url)
        .then((response) => {
          this.newsList = response.data;
        })
        .catch((error) => {
          console.error("Error loading news:", error);
        });

      this.sortBy = "";
      this.sortOrder = "";
    },
    applySorting() {
      let url = "http://localhost:8080/api/sortedNews";
      let params = [];

      if (this.query) params.push(`keyword=${this.query}`);
      if (this.selectedSource) params.push(`source=${this.selectedSource}`);
      if (this.sortBy) params.push(`sortBy=${this.sortBy}`);
      if (this.sortOrder) params.push(`sortOrder=${this.sortOrder}`);

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      axios
        .get(url)
        .then((response) => {
          this.newsList = response.data;
        })
        .catch((error) => {
          console.error("Error loading news:", error);
        });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return format(date, "dd.MM.yyyy, HH:mm");
    },
  },
  mounted() {
    this.fetchNews();
  },
};
</script>
