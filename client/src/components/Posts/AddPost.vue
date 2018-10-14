<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="secondaryDark--text">新增文章</h1>
      </v-flex>
    </v-layout>

    <!-- form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>

        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="addPost">

          <!-- 標題 title input -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="titleRules" v-model="title" label="標題" type="text" required></v-text-field>
            </v-flex>
          </v-layout>

          <!-- 圖片網址 image url input -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="imageRules" v-model="imageUrl" label="圖片網址" type="text" required></v-text-field>
            </v-flex>
          </v-layout>

          <!-- 圖片預覽 image preview -->
          <v-layout row>
            <v-flex xs12>
              <img :src="imageUrl" height="300px">
            </v-flex>
          </v-layout>

          <!-- 類別選單 categories select -->
          <v-layout row>
            <v-flex xs12>
              <v-select :rules="categoriesRules" v-model="categories" :items="[
              'Art',
              'Education',
              'news',
              'travel',
              'photography',
              'technology',
              'food'
              ]" multiple label="類別">
              </v-select>
            </v-flex>
          </v-layout>

          <!-- 文章內容 description textarea -->
          <v-layout row>
            <v-flex xs12>
              <v-textarea :rules="descRules" v-model="description" label="文章內容" type="text"></v-textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn :loading="loading" color="primary" type="submit" :disabled="!isFormValid || loading">
                送出
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>

      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "標題不可為空",
        title => title.length < 30 || "標題不可大於30個字元"
      ],
      imageRules: [image => !!image || "圖片網址不可為空"],
      categoriesRules: [categories => !!categories.length >= 1 || "至少要選一個文章類別"],
      descRules: [
        desc => !!desc || "文章內容不可為空",
        desc => desc.length < 500 || "內容不可大於500個字元"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "user"])
  },
  methods: {
    addPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
        this.$router.push("/");
      }
    }
  }
};
</script>
