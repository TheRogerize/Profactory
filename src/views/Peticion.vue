<template>
    <div id="show-blogs">
    <h1>All Blog Articles</h1>
    <div class="single-blog"></div>
    </div>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue-resource@1.3.4"></script>
<script>

import axios from 'axios'

export default {
    data(){
        
        return{
            blogs:[]
        }
    },
    methods:{

    }
    
}
</script>
