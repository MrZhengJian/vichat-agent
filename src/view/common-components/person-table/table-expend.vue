<script type="text/javascript">
/* eslint-disable */
</script>
<style scoped>
    .aaa{
        margin:0 100px 0 10px;
    }
    .ivu-col{
        padding:0 5px;
    }
</style>
<template>
    <div class='aaa'>
        <Row>
            <Col span='24'>
                <span class="expand-key">SN : </span>
                <span class="expand-value">{{ row.imei }}</span>
            </Col>
        </Row>        
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>