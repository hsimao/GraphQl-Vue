<template>
  <div>
    <h1>{{postId}}</h1>
  </div>
</template>

<script>
export default {
  name: "Post",
  props: {
    postId: String
  }
};
</script>